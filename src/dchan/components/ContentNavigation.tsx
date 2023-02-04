import { Board } from "dchan/subgraph/types";
import { DateTime } from "luxon";
import { Router } from "router";
import { Anchor } from ".";
import { Link } from "react-router-dom";
import useTimeTravel from "dchan/hooks/useTimeTravel";

export const ContentNavigation = ({
  board,
  dateTime,
}: {
  board: Board;
  dateTime?: DateTime;
}) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
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
      <span>
        <span className="pr-1">
          [
          <Link
            className="dchan-link"
            to={`${Router.board(board, "index")}${timeTravelURL}`}
          >
            Index
          </Link>
          ]
        </span>
        <span className="pr-1">
          [
          <Link
            className="dchan-link"
            to={`${Router.board(board, "catalog")}${timeTravelURL}`}
          >
            Catalog
          </Link>
          ]
        </span>
        <span className="pr-1">
          [
          <Link
            className="dchan-link"
            to={`${Router.board(board, "archive")}${timeTravelURL}`}
          >
            Archive
          </Link>
          ]
        </span>
      </span>

      <Anchor to="#bottom" label="Bottom" />
    </span>
  );
}
