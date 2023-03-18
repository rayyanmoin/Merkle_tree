const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("TREE", () => {
  const nodes = [
    '0xe1C692135A24A81D42457AB454F155D22B4B9C2B',
    '0xA22B1a3D2aE3719fcE4411cc84243EA6A2166460',
    '0x2d6A4701Dcfec3F69046aa5c7169017d4a7D5730',
    '0x12AD5254818B0F85E9383699d5eB17b7DB95CB2F',
    '0xB8288872ccA7C3dd543206AAFf0925a71B45C148',
    '0x710bDa329b2a6224E4B44833DE30F38E7f81d564',
    '0x9fd73f30BDb4B1EAD1Ac4D377B99917576671aBF',
    '0x9DEeFBa1A459A651A4bB4FF8d1DcD5f7f783f88C'
]
const alphas = ['a','b','c','d','e','f','g','h']
const counting =  ['1','2','3','4','5','6','7','8']


  const leaves =counting.map(
    (node) => "0x" + keccak256(node).toString("hex")
  );

  const tree = new MerkleTree(leaves, keccak256);
  const root = tree.getHexRoot();
  const leaf = leaves[0];

  let proof = tree.getHexProof(leaf);
  console.log(proof, root, leaf);

  async function deployMarkleTree() {
    const MarkleTree = await ethers.getContractFactory("MarkleTree");
    const markleTree = await MarkleTree.deploy();
    return { markleTree };
  }

  describe("markle contract testing", () => {
    it("some random description", async () => {
      const { markleTree } = await deployMarkleTree();
      expect(markleTree.address).to.be.string;
    });
    it("testing user `a` markle proofto be true", async () => {
      const { markleTree } = await deployMarkleTree();

      expect(await markleTree.verifyCalldata(proof, root, leaf)).to.be.true;
    });
    it("testing user `x` markle proof to be false", async () => {
      const { markleTree } = await deployMarkleTree();
      const leaf = "0x" + keccak256("x").toString("hex");

      expect(await markleTree.verifyCalldata(proof, root, leaf)).to.be.false;
    });
  });
});
