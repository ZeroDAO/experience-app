<p align="center">
  <img src="http://docs.zerodao.net/logo-ui-d.svg" width="460">
</p>

# ZeroDAO Experience App

This is the experience and testing front-end for [ZeroDAO-node](https://github.com/ZeroDAO/ZeroDAO-node), with built-in GOT test data.

## Run

### Install the dependencies

```bash
yarn
```

### Start the app in development mode

```bash
yarn dev
```

### Build the app for production

```bash
yarn build
```

## Docker

You can run a docker container via -

```bash
docker run --rm -it --name zerodao-eapp -p 8080:8080 zerodao/zerodao-eapp:v0.0.1
```

When using these Docker commands, you can access the UI via http://localhost:8080 .

## Visualized Tests

### GOT

The Game of Thrones character relationship test data is built into the experience-app, click on "Tests" in the left hand navigation

![start](https://pic.tom24h.com/zerodao/github/start.png)

click on the "Start" button on the right hand side and the front-end will automatically run a simulation to send various types of transactions to the chain. 

![info](https://pic.tom24h.com/zerodao/github/info.png)

Please be patient as the browser may lag due to the large amount of data. Once the data has been imported, you can see all the seeds from the *Seeds* page

![seeds](https://pic.tom24h.com/zerodao/github/seeds.png)

Click on them to go to the home page where you can see the character's trust relationships, reputation values and so on.

![user](https://pic.tom24h.com/zerodao/github/user.png)

If you have the Polkadot.js browser connected, you should be able to see a lot of transaction information and events.

![blocks](https://pic.tom24h.com/zerodao/github/blocks.png)

#### Data Source

The GOT network uses the following data, they are all undirected, we remove the relationship of users with less than 10 interactions to higher centrality users to make it closer to the real network.

[Game of Thrones Datasets and Visualizations](https://github.com/jeffreylancaster/game-of-thrones)
[gameofthrones](https://github.com/mathbeveridge/gameofthrones)

### Data Import

You can customise your own data. Place the following files in `. /src/testing-utils/data/`

#### nodes.cvs

Stores the user information. The format is

| id      | label     |
| :------ | :-------- |
| USER_ID | user name |

#### edges.cvs

The trust relationship is stored. The format is

| source    | target    |
| :-------- | :-------- |
| USER_ID_1 | USER_ID_2 |

Next, calculate centrality, select seeds, and calculate reputation.

#### Test

```base
yarn preTest
```

Output

```base
init...
Success: write edges.json
Success: write edges_set.json
Success: addNodes - 407
Success: addEdges - 3511
Success: write betweenness
Success: write seeds
Success: write seeds paths
Success: write reputations to nodes
Done in 2.61s.
```

All the data writed to the `data` folder. Run `yarn dev`.
