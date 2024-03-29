import { regexp as brokenRegexp, string, Parjser } from "parjs";
import {
  map,
  backtrack,
  thenq,
  qthen,
  many,
  or,
  later,
  between,
} from "parjs/combinators";
import uniqueId from "lodash/uniqueId";

// known bug with parjs
const regexp: (origRegexp: RegExp) => Parjser<string[]> = brokenRegexp.bind({});

export type TextValue = {
  type: "text";
  key: string;
  value: string;
};

export type LinkValue = {
  type: "link";
  key: string;
  value: string;
};

export type IPFSValue = {
  type: "ipfs";
  key: string;
  hash: string;
};

export type NewlineValue = {
  type: "newline";
  key: string;
};

export type ReferenceValue = {
  type: "ref";
  key: string;
  id: string;
};

export type TxHashReferenceValue = {
  type: "txhashref";
  key: string;
  id: string;
};

export type PostReferenceValue = {
  type: "postref";
  key: string;
  id: string;
  n: string;
};

export type BoardReferenceValue = {
  type: "boardref";
  key: string;
  board: string;
  id: string;
};

export type SpoilerValue = {
  type: "spoiler";
  key: string;
  value: ParserResult[];
};

export type TextQuoteValue = {
  type: "textquote";
  key: string;
  value: ParserResult[];
};

export type YoutubeLinkValue = {
  type: "youtubelink";
  key: string;
  id: string;
  url: string;
};

export type SoundcloudLinkValue = {
  type: "soundcloudlink";
  key: string;
  id: string;
  url: string;
};

export type ParserResult =
  | TextValue
  | LinkValue
  | IPFSValue
  | NewlineValue
  | ReferenceValue
  | TxHashReferenceValue
  | PostReferenceValue
  | BoardReferenceValue
  | SpoilerValue
  | TextQuoteValue
  | YoutubeLinkValue
  | SoundcloudLinkValue;

function alt<T>(p1: Parjser<T>, ...ps: Parjser<T>[]): Parjser<T> {
  // @ts-ignore
  return or(...ps)(p1);
}

function mergeText(vals: ParserResult[]): ParserResult[] {
  const ret: ParserResult[] = [];
  if (vals.length === 0) {
    return vals;
  }
  let curVal = vals[0];
  for (let i = 1; i < vals.length; i++) {
    const val = vals[i];
    if (curVal.type === "text" && val.type === "text") {
      curVal.value += val.value;
      curVal.key += val.key;
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
  map((vals) => ({
    type: "text",
    key: vals[0],
    value: vals[0],
  }))
);

const ipfsHash: Parjser<IPFSValue> = regexp(/(Qm[1-9A-Za-z]{44})/).pipe(
  map((vals) => ({
    type: "ipfs",
    key: vals[0],
    hash: vals[0],
  }))
);

const newline: Parjser<NewlineValue> = string("\n").pipe(
  map(() => ({
    type: "newline",
    key: "",
  }))
);

const reference: Parjser<ReferenceValue> = regexp(/>>(0[xX][0-9a-fA-F]+)/).pipe(
  map((vals) => ({ type: "ref", key: vals[1], id: vals[1] }))
);

// @TODO This doesn't work, it should highlight tx hashes such as http://localhost:4000/#/0x05157cc76a3ad4b7d721eab50cd8c503aa16d647d6285471cd2f32d1e8076596
const txHashReference: Parjser<TxHashReferenceValue> = regexp(
  /(0[xX][0-9a-fA-F]+)/
).pipe(map((vals) => ({ type: "txhashref", key: vals[1], id: vals[1] })));

const postReference: Parjser<PostReferenceValue> = regexp(
  />>(?:(0[xX][0-9a-fA-F]+)\/)?(\d+)/
).pipe(
  map((vals) => ({
    type: "postref",
    key: `${vals[1]}/${vals[2]}`,
    id: vals[1],
    n: vals[2],
  }))
);

const boardReference: Parjser<BoardReferenceValue> = regexp(
  />>(\/[a-zA-Z]+\/)(0[xX][0-9a-fA-F]+(?:\/\d+)?)?/
).pipe(
  map((vals) => ({
    type: "boardref",
    key: `${vals[1]}${vals[2]}`,
    board: vals[1],
    id: vals[2],
  }))
);

const altReference = alt<ParserResult>(
  txHashReference,
  boardReference,
  postReference,
  reference
);

const link: Parjser<LinkValue> = regexp(
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i
).pipe(
  map((vals) => ({
    type: "link",
    key: vals[0],
    value: vals[0],
  }))
);

const spoilerBody = later<ParserResult>();

const spoiler: Parjser<SpoilerValue> = spoilerBody.pipe(
  many(),
  between("[spoiler]", "[/spoiler]"),
  map((body) => {
    const items = mergeText(body);
    for (let i = 0; i < items.length; i++) {
      items[i].key += ` ${i}`;
    }
    return {
      type: "spoiler",
      key: uniqueId("spoiler_"),
      value: items,
    };
  })
);

const spoilerText: Parjser<TextValue> = regexp(/[^[][^[\n>hfQ]*/g).pipe(
  map((vals) => ({
    type: "text",
    key: vals[0],
    value: vals[0],
  }))
);

// https://stackoverflow.com/a/37704433
const youtubeLink: Parjser<YoutubeLinkValue> = regexp(/((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?/g).pipe(
  map((vals) => ({
    type: "youtubelink",
    key: vals[6],
    id: vals[6],
    url: vals[0]
  }))
);
const soundcloudLink: Parjser<SoundcloudLinkValue> = regexp(/https?:\/\/(www\.)?soundcloud\.com\/.+\w/g).pipe(
  map((vals) => ({
    type: "soundcloudlink",
    key: vals[6],
    id: vals[6],
    url: vals[0]
  }))
);

spoilerBody.init(
  alt(altReference, spoiler, link, ipfsHash, newline, spoilerText, youtubeLink, soundcloudLink)
);

const commonBase = alt<ParserResult>(spoiler, youtubeLink, soundcloudLink, link, ipfsHash, text);

const textQuote: Parjser<TextQuoteValue> = regexp(/^>/m).pipe(
  qthen(alt(altReference, commonBase).pipe(many())),
  thenq(regexp(/$/m).pipe(backtrack())),
  map((body) => {
    const items = mergeText(body);
    for (let i = 0; i < items.length; i++) {
      items[i].key += ` ${i}`;
    }
    return {
      type: "textquote",
      key: uniqueId("textquote_"),
      value: items,
    };
  })
);

const post: Parjser<ParserResult[]> = alt(
  altReference,
  textQuote,
  newline,
  commonBase
).pipe(
  many(),
  map((body) => {
    const items = mergeText(body);
    for (let i = 0; i < items.length; i++) {
      items[i].key += ` ${i}`;
    }
    return items;
  })
);

export const parseComment = (comment: string): ParserResult[] => {
  if (comment === "") {
    return [];
  }
  return post.parse(comment).value;
}
