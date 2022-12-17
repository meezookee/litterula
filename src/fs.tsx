import FS from "@isomorphic-git/lightning-fs";

export const fs = new FS("litterula");
export const pfs = fs.promises;
