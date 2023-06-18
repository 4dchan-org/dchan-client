dchan-client
-----
Official client for the [4dchan.org](https://4dchan.org) decentralized imageboard.

* Lightweight (~350kb gzipped)
* IPFS hostable
* Built with [React](https://reactjs.org/)
* Powered by [The Graph](https://thegraph.com)
  * No server required, uncensorable, always online

## Development
* `npm run dev`

### Docker

Required:
- `GNU+Linux`
- [`docker`](https://docs.docker.com/engine/install/#server) 
- [`docker-compose`](https://docs.docker.com/compose/install/)

#### Setup
- `cp docker-compose.dist.yml docker-compose.yml`

#### Start development
- `./bin/docker/dev.sh`

#### Build production release
- `./bin/docker/build.sh`

# Links
- Official website: https://4dchan.org/
- Source: https://github.com/4dchan-org/dchan-client
- More Source: https://github.com/4dchan-org/
