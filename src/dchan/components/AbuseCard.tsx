import { Card, Overlay } from "dchan/components";
import { useState } from "react";
import { singletonHook } from "react-singleton-hook";

export function AbuseCard() {
  return (
    <Card title={<div className="">Abuse (DMCA/CSAM)</div>} collapsible={false}>
      <div className="text-left p-4">
        <div className="p-2 text-xs">
          <strong>Disclaimer</strong>
          <br />
          This is a decentralized application: all media content is uploaded and
          retrieved via IPFS directly by the users.
          <br />
          It is important to understand that due to the nature of IPFS, it may
          not be possible to fully delete media once it has been uploaded.
          <br />
          When a file is uploaded to IPFS, it is distributed across the network
          and stored on multiple nodes, meaning that once a file has been added
          to IPFS, it can only be deleted by physically removing it from each
          node where it is stored, which is a complex and time-consuming process
          and not within the capabilities of this dapp's owners.
          <br />
          Therefore, users are advised to be cautious when uploading sensitive
          or personal information to IPFS.
          <br />
          No one can guarantee that media will be fully deleted or inaccessible
          even if it has been removed from this dapp.
          <br />
          By using IPFS, you understand and agree that you are solely
          responsible for the persistence and/or availability of the media
          uploaded to the network.
          <br />
          Users are strongly encouraged to use the dapp responsibly and to
          always consider the potential long-term consequences of the media they
          are uploading.
          <br />
        </div>
        <hr />
        <div className="p-2">
          <strong>Abuse Policy</strong>
          <br />
          The policy regarding the handling of copyright infringement claims
          (DMCA) and of child sexual abuse material (CSAM) on this
          dapp is the following.
          <br />
          <br />
          <strong>Copyright Infringement Claims</strong>
          <br />
          It is the users' responsibility to respect the intellectual property
          rights of others.
          <br />
          If you believe that your copyrighted work has been copied in a way
          that constitutes copyright infringement, please immediately report it
          via the built-in report feature and provide the following information
          to{" "}
          <a
            className="dchan-link"
            target="_blank"
            rel="noreferrer"
            href="mailto:dmca@dchan.network"
          >
            dmca@dchan.network
          </a>
          <br />
          <ul className="list-disc p-4">
            <li>
              A physical or electronic signature of the copyright owner or a
              person authorized to act on their behalf;
            </li>
            <li>
              Identification of the copyrighted work claimed to have been
              infringed;
            </li>
            <li>
              Identification of the material that is claimed to be infringing or
              to be the subject of infringing activity;
            </li>
            <li>
              Information reasonably sufficient to permit us to contact you,
              such as an address, telephone number, and, if available, an email
              address;
            </li>
            <li>
              A statement that you have a good faith belief that use of the
              material in the manner complained of is not authorized by the
              copyright owner, its agent, or the law;
            </li>
            <li>
              A statement that the information in the notification is accurate,
              and under penalty of perjury, that you are authorized to act on
              behalf of the copyright owner.
            </li>
          </ul>
          <br />
          <strong>Child Sexual Abuse Material (CSAM) Reporting</strong>
          <br />
          If you encounter any such content on this dapp, please immediately
          report it via the built-in report feature and to{" "}
          <a
            className="dchan-link"
            target="_blank"
            rel="noreferrer"
            href="mailto:csam@dchan.network"
          >
            csam@dchan.network
          </a>
          .
          <br />
          There is a zero-tolerance policy for the distribution of child sexual
          abuse material (CSAM) and immediate action will be taken.
          <br />
          All known information about the uploader or distributor of the
          material will be provided to law enforcement.
          <br />
        </div>
        <hr />
        <div className="p-2">
          If you have any questions or concerns about the DMCA/CSAM policy,
          please contact us at{" "}
          <a
            className="dchan-link"
            target="_blank"
            rel="noreferrer"
            href="mailto:abuse@dchan.network"
          >
            abuse@dchan.network
          </a>
          .
        </div>
      </div>
    </Card>
  );
}

export const useAbuse = singletonHook<[boolean, (open: boolean) => void]>(
  [false, () => {}],
  () => {
    return useState<boolean>(false);
  }
);

export function AbuseCardOverlay() {
  const [openAbuse, setOpenAbuse] = useAbuse();
  return openAbuse ? (
    <Overlay onExit={() => setOpenAbuse(false)}>
      <AbuseCard />
    </Overlay>
  ) : null;
}

export const AbuseButton = ({ className = "" }: { className?: string }) => {
  const [, setOpenAbuse] = useAbuse();
  return (
    <>
      <span
        className={`${className} cursor-pointer dchan-link`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpenAbuse(true);
        }}
      >
        Abuse (DMCA/CSAM)
      </span>
    </>
  );
};
