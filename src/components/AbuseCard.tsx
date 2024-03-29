import { Card } from "src/components";
import { useModal } from "src/hooks";

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
          not be possible to fully delete uploaded media.
          <br />
          When a file is uploaded to IPFS, it is distributed across the network
          and stored on multiple nodes, meaning that once a file has been added
          to IPFS, it can only be deleted by physically removing it from each
          node where it is stored, which is an impossibly complex and time-consuming process
          and not within the capabilities of this dapp's owners, nor anyone else's.
          <br />
          Therefore, users are advised to be cautious when uploading sensitive
          or personal information, or content which may be deemed illegal 
          by any jurisdiction: use IPFS responsibly and
          always consider the potential long-term consequences of the media you
          are uploading.
          <br />
          By using IPFS, you understand and agree that you are solely
          responsible for the persistence and/or availability of the media
          uploaded to the network. 
          <br />
        </div>
        <hr />
        <div className="p-2">
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
            href="mailto:dmca@4dchan.org"
          >
            dmca@4dchan.org
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
            href="mailto:csam@4dchan.org"
          >
            csam@4dchan.org
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
            href="mailto:abuse@4dchan.org"
          >
            abuse@4dchan.org
          </a>
          .
        </div>
      </div>
    </Card>
  );
}

export const AbuseButton = ({ className = "" }: { className?: string }) => {
  const [, setOpen] = useModal();
  return (
    <>
      <span
        className={`${className} cursor-pointer dchan-link`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen('abuse');
        }}
      >
        Abuse (DMCA/CSAM)
      </span>
    </>
  );
};
