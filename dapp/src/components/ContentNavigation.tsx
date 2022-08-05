import { Board } from "dchan";
import { DateTime } from "luxon";
import { Router } from "router";
import Anchor from "./Anchor";
import { Link } from "react-router-dom";

export default function ContentNavigation({
  board,
  block,
  dateTime,
}: {
  board: Board;
  block?: string;
  dateTime?: DateTime;
}) {
  let timeTravelParameters: {block?: string, date?: string} = {};
  if (block) {
    timeTravelParameters.block = `${block}`;
  }
  if (dateTime != null) {
    timeTravelParameters.date = dateTime.toISODate();
  }
  const timeTravelURL = timeTravelParameters
    ? `?${Object.entries(timeTravelParameters).map(x => (x[0] + "=" + x[1])).join("&")}`
    : "";

  return (
    <span className="whitespace-nowrap sm:flex">
      <span className="pr-1">
        <span className="pr-1">
          [
          <Link
            className="dchan-link"
            to={`${Router.board(board)}/index${timeTravelURL}`}
          >
            Index
          </Link>
          ]
        </span>
        <span className="pr-1">
          [
          <Link
            className="dchan-link"
            to={`${Router.board(board)}/catalog${timeTravelURL}`}
          >
            Catalog
          </Link>
          ]
        </span>
      </span>

      <Anchor to="#bottom" label="Bottom" />
    </span>
  );
}
