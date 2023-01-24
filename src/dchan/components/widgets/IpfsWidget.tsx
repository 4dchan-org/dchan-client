import { useState, useEffect } from 'react';
import { useIpfsFactory, useIpfs } from 'dchan/hooks'

export const IPFSWidget = () => {
  const { ipfs, ipfsInitError } = useIpfsFactory()
  const id = useIpfs(ipfs, 'id')
  const [version, setVersion] = useState(null)

  useEffect(() => {
    if (!ipfs) return;

    const getVersion = async () => {
      const nodeId = await ipfs.version();
      setVersion(nodeId);
    }

    getVersion();
  }, [ipfs])

  return (
    <div className='sans-serif'>
      <header className='flex items-center pa3 bg-navy bb bw3 b--aqua'>
        <h1 className='flex-auto ma0 tr f3 fw2 montserrat aqua'>IPFS React</h1>
      </header>
      <main>
        {ipfsInitError && (
          <div className='bg-red pa3 mw7 center mv3 white'>
            Error: {(ipfsInitError as any).message || ipfsInitError}
          </div>
        )}
        {(id || version) &&
            <section className='bg-snow mw7 center mt5'>
            <h1 className='f3 fw4 ma0 pv3 aqua montserrat tc' data-test='title'>Connected to IPFS</h1>
            <div className='pa4'>
              {id && <IpfsId obj={id} keys={['id', 'agentVersion']}/>}
              {version && <IpfsId obj={version} keys={['version']}/>}
            </div>
          </section>
        }
      </main>
      <footer className="react-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="react-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </footer>
    </div>
  );
}

const Title = ({ children }: any) => {
  return (
    <h2 className='f5 ma0 pb2 aqua fw4 montserrat'>{children}</h2>
  )
}

const IpfsId = ({keys, obj}: any) => {
  if (!obj || !keys || keys.length === 0) return null
  return (
    <>
      {keys?.map((key: any) => (
        <div className='mb4' key={key}>
          <Title>{key}</Title>
          <div className='bg-white pa2 br2 truncate monospace' data-test={key}>{obj[key].toString()}</div>
        </div>
      ))}
    </>
  )
}