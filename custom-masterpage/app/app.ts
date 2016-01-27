/// <reference path="navfly.ts" />
/// <reference path="c:\users\USERID\documents\visual studio 2015\projects\custom-sharepoint\scripts\typings\sharepoint\sharepoint.d.ts" />

import {FlyDown} from './navFly';

let init = () => {
  //let elements: HTMLCollection = <HTMLCollection>document.querySelectorAll('li.dynamic.dynamic-children');
  let fixFly: FlyDown = new FlyDown('li.dynamic.dynamic-children');
  fixFly.adjustFly();
}

SP.SOD.executeFunc('sp.js', 'SP.ClientContext', init);