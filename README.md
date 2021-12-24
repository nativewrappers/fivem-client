<h1 align="center">native-wrappers-client</h1>

<p align="center">
  <i>:fire: A Javascript/Typescript wrapper for the FiveM natives :video_game:</i>
  <br>
  <br>
  <a href="https://github.com/AvarianKnight/native-wrappers-client/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="License: MIT">
  </a>
  <a href="https://www.npmjs.com/package/@nativewrappers/client">
    <img src="https://img.shields.io/npm/v/@nativewrappers/client?style=flat" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/@nativewrappers/client">
    <img src="https://img.shields.io/npm/dm/@nativewrappers/client?style=flat">
  </a>
  <a href="https://circleci.com/gh/AvarianKnight/@nativewrappers/client">
    <img src="https://img.shields.io/circleci/build/github/AvarianKnight/native-wrappers-client" alt="Build Status">
  </a>
  <a href="https://github.com/AvarianKnight/native-wrappers-client/commits/master">
    <img src="https://img.shields.io/github/last-commit/AvarianKnight/native-wrappers-client.svg?style=flat" alt="Last commit">
  </a>
  <!-- <a href="https://discord.d0p3t.nl">
    <img src="https://img.shields.io/discord/330910293934997504?label=Discord" alt="Discord">
  </a> -->
</p>

<p align="center">
  <a href="https://fivemjs.avarian.dev/">Documentation</a>
  -
  <a href="https://forum.fivem.net/t/fivem-js-v1-3-2-javascript-typescript-wrapper-now-with-menu-class-nativeui/268640">Forum</a>
  <!-- - -->
  <!-- <a href="https://discord.d0p3t.nl">Discord</a> -->
</p>

This is a continuation of [fivem-js](https://github.com/d0p3t/fivem-js), who's maintainer has sadly passed away.

This project is in no way affiliated with FiveM or the Cfx Collective.

Functionality of this wrapper is **based on the FiveM C# wrapper** - [link](https://github.com/citizenfx/fivem/tree/master/code/client/clrcore/External). It's a feature-rich set of helper classes, objects, and functions to help you develop your project faster.

## Features

- One dependency [@citizenfx/client](https://www.npmjs.com/package/@citizenfx/client)
- Abstracts common used FiveM practices
- Entity management through class objects (i.e. `Vehicle` and `Ped` entities)
- UI elements such as `scaleforms` and loading `prompts`
- Audio, Blips, Cameras and more...

In other words, whatever the FiveM C# wrapper can do, this package can as well and more!

## Download & Install

`yarn add @nativewrappers/client`

or

`npm i @nativewrappers/client"`

https://www.npmjs.com/package/@nativewrappers/client


## Simple Usage

See [here](https://github.com/AvarianKnight/native-wrappers-client/tree/master/examples) for example projects.

### Typescript

```typescript
import * as Cfx from '@nativewrappers/client';

RegisterCommand(
  'adder',
  async (source: number, args: string[]) => {
    const vehicle = await Cfx.World.createVehicle(
      new Cfx.Model('adder'),
      new Cfx.Vector3(1, 2, 3),
      4,
    );
    Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
  },
  false,
);
```

You can also individually import classes.

```typescript
import { World } from '@nativewrappers/client/lib/World';
```

### Javascript

```js
/// <reference path="node_modules/@nativewrappers/client/lib/index.d.ts"/>
/// <reference path="node_modules/@citizenfx/client/natives_universal.d.ts"/>

const Cfx = require('@nativewrappers/client');

RegisterCommand(
  'adder',
  async (source, args) => {
    const vehicle = await Cfx.World.createVehicle(
      new Cfx.Model('adder'),
      new Cfx.Vector3(1, 2, 3),
      4,
    );
    Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
  },
  false,
);
```

## Community Chat

You can join our public help Discord [here](https://discord.d0p3t.nl)

## Contributing

You are more than welcome to contribute to this project by submitting a pull request and creating issues.

Please checkout [CONTRIBUTING.md](./CONTRIBUTING.md) for our contributing guidelines.

## License

MIT with customization. See [LICENSE](https://github.com/AvarianKnight/native-wrappers-client/blob/master/LICENSE)
