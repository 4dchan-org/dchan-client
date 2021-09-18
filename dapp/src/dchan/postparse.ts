import { regexp as brokenRegexp, string, eof, Parjser } from "parjs";
import { map, backtrack, then, thenq, qthen, many, or, later, mapConst, flatten, between } from "parjs/combinators";

// known bug with parjs
const regexp: (origRegexp: RegExp) => Parjser<string[]> = brokenRegexp.bind({});

export type TextValue = {
  type: "text";
  value: string;
}

export type LinkValue = {
  type: "link";
  value: string;
}

export type IPFSValue = {
  type: "ipfs";
  hash: string;
}

export type NewlineValue = {
  type: "newline";
}

export type ReferenceValue = {
  type: "ref";
  id: string;
}

export type PostReferenceValue = {
  type: "postref";
  id: string;
  n: string;
}

export type BoardReferenceValue = {
  type: "boardref";
  board: string;
  id: string;
}

export type SpoilerValue = {
  type: "spoiler";
  value: ParserResult[];
};

export type TextQuoteValue = {
  type: "textquote";
  value: ParserResult[];
}

export type ParserResult = TextValue
                         | LinkValue
                         | IPFSValue
                         | NewlineValue
                         | ReferenceValue
                         | PostReferenceValue
                         | BoardReferenceValue
                         | SpoilerValue
                         | TextQuoteValue;

function alt<T>(p1: Parjser<T>, ...ps: Parjser<T>[]): Parjser<T> {
  // @ts-ignore
  return or(...ps)(p1);
}

function mergeText(vals: ParserResult[]): ParserResult[] {
  let ret: ParserResult[] = []
  if (vals.length === 0) {
    return vals;
  }
  let curVal = vals[0];
  for (let i = 1; i < vals.length; i++) {
    let val = vals[i];
    if (curVal.type === "text" && val.type === "text") {
      curVal.value += val.value;
    } else {
      ret.push(curVal);
      curVal = vals[i];
    }
  }
  ret.push(curVal);
  return ret;
}

// qthen(a)(b) yields a
// thenq(a)(b) yields b

const text: Parjser<TextValue> = regexp(/.[^[\n>hfQ]*/g).pipe(
  map(v => ({type: "text", value: v[0]}))
);

const ipfsHash: Parjser<IPFSValue> = regexp(/(Qm[1-9A-Za-z]{44})/).pipe(
  map(v => ({type: "ipfs", hash: v[0]}))
)

const newline: Parjser<NewlineValue> = string("\n").pipe(
  mapConst({type: "newline"})
);

const reference: Parjser<ReferenceValue> = regexp(/>>(0[xX][0-9a-fA-F]+)/).pipe(
  map(vals => ({type: "ref", id: vals[1]}))
);

const postReference: Parjser<PostReferenceValue> = regexp(/>>(0[xX][0-9a-fA-F]+)\/(\d+)/).pipe(
  map(vals => ({type: "postref", id: vals[1], n: vals[2]}))
);

const boardReference: Parjser<BoardReferenceValue> = regexp(/>>(\/[a-zA-Z]+\/)(0[xX][0-9a-fA-F]+(?:\/\d+)?)?/).pipe(
  map(vals => ({type: "boardref", board: vals[1], id: vals[2]}))
);

const altReference = alt<ParserResult>(boardReference, postReference, reference);

const newlineReference: Parjser<[NewlineValue, ReferenceValue]> = regexp(/\n>>(0[xX][0-9a-fA-F]+)/).pipe(
  map(vals => [{type: "newline"}, {type: "ref", id: vals[1]}])
);

const newlinePostReference: Parjser<[NewlineValue, PostReferenceValue]> = regexp(/\n>>(0[xX][0-9a-fA-F]+)\/(\d+)/).pipe(
  map(vals => [{type: "newline"}, {type: "postref", id: vals[1], n: vals[2]}])
);

const newlineBoardReference: Parjser<[NewlineValue, BoardReferenceValue]> = regexp(/\n>>(\/[a-zA-Z]+\/)(0[xX][0-9a-fA-F]+(?:\/\d+)?)?/).pipe(
  map(vals => [{type: "newline"}, {type: "boardref", board: vals[1], id: vals[2]}])
);

const newlineAltReference = alt<[NewlineValue, ParserResult]>(newlineBoardReference, newlinePostReference, newlineReference);

const link: Parjser<LinkValue> = regexp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i).pipe(
  map(val => ({type: "link", value: val[0]}))
);

const spoilerBody = later<ParserResult>();

const spoiler: Parjser<SpoilerValue> = spoilerBody.pipe(
  many(),
  between("[spoiler]", "[/spoiler]"),
  map(value => ({type: "spoiler", value: mergeText(value)}))
);

const spoilerText: Parjser<TextValue> = regexp(/[^[][^[\n>hfQ]*/g).pipe(
  map(v => ({type: "text", value: v[0]}))
);

spoilerBody.init(
  alt<ParserResult>(altReference, spoiler, link, ipfsHash, newline, spoilerText)
);

const commonBase = alt<ParserResult>(spoiler, link, ipfsHash, text);

const endline = alt(string("\n"), eof());

const textQuoteStart: Parjser<TextQuoteValue> = string(">").pipe(
  qthen(alt<ParserResult>(altReference, commonBase).pipe(many())),
  thenq(endline.pipe(backtrack())),
  map(value => ({type: "textquote", value: mergeText(value)}))
);

const textQuote: Parjser<[NewlineValue, TextQuoteValue]> = string("\n>").pipe(
  qthen(alt<ParserResult>(altReference, commonBase).pipe(many())),
  thenq(endline.pipe(backtrack())),
  map(value => [{type: "newline"}, {type: "textquote", value: mergeText(value)}])
);

const post: Parjser<ParserResult[]> = alt<ParserResult>(altReference, textQuoteStart, newline, commonBase).pipe(
  then(alt<any>(newlineAltReference, altReference, textQuote, newline, commonBase).pipe(many(), flatten())),
  map(v => mergeText([v[0], ...v[1]])),
);

export default function parseComment(comment: string): ParserResult[] {
  if (comment === "") {
    return [];
  }
  return post.parse(comment).value;
}