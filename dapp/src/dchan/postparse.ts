import { regexp as brokenRegexp, string, Parjser } from "parjs";
import { map, backtrack, thenq, qthen, many, or, later, mapConst, between } from "parjs/combinators";

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

export type CodeValue = {
  type: "code";
  value: ParserResult[];
};

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
                         | CodeValue
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
  map(vals => ({type: "text", value: vals[0]}))
);

const ipfsHash: Parjser<IPFSValue> = regexp(/(Qm[1-9A-Za-z]{44})/).pipe(
  map(vals => ({type: "ipfs", hash: vals[0]}))
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

const link: Parjser<LinkValue> = regexp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i).pipe(
  map(vals => ({type: "link", value: vals[0]}))
);

const codeBody = later<ParserResult>();

const code: Parjser<CodeValue> = codeBody.pipe(
  many(),
  between("`", "`"),
  map(body => ({type: "code", value: mergeText(body)}))
);

const codeText: Parjser<TextValue> = regexp(/[^[][^[\n>hfQ]*/g).pipe(
  map(vals => ({type: "text", value: vals[0]}))
);

const spoilerBody = later<ParserResult>();

const spoiler: Parjser<SpoilerValue> = spoilerBody.pipe(
  many(),
  between("[spoiler]", "[/spoiler]"),
  map(body => ({type: "spoiler", value: mergeText(body)}))
);

const spoilerText: Parjser<TextValue> = regexp(/[^[][^[\n>hfQ]*/g).pipe(
  map(vals => ({type: "text", value: vals[0]}))
);

spoilerBody.init(
  alt(altReference, spoiler, link, ipfsHash, newline, spoilerText, code, codeText)
);

const commonBase = alt<ParserResult>(spoiler, link, ipfsHash, text);

const textQuote: Parjser<TextQuoteValue> = regexp(/^>/m).pipe(
  qthen(alt(altReference, commonBase).pipe(many())),
  thenq(regexp(/$/m).pipe(backtrack())),
  map(body => ({type: "textquote", value: mergeText(body)}))
);

const post: Parjser<ParserResult[]> = alt(altReference, textQuote, newline, commonBase).pipe(
  many(),
  map(mergeText),
);

export default function parseComment(comment: string): ParserResult[] {
  if (comment === "") {
    return [];
  }
  return post.parse(comment).value;
}