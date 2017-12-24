import traverse from '../../src/accordion-menu/src/util/traverse.js';
import chai from 'chai';

const should = chai.should();

describe('Util', function() {
    //
    describe('traverse', function() {
        const tree = [
            {
                id: 1,
                name: 'mocha',
                children: [
                    {
                        id: 11,
                        name: 'hello',
                        children: [
                            {
                                id: 112,
                                name: 'chai'
                            },
                            {
                                id: 119,
                                name: 'latte'
                            }
                        ]
                    },
                    {
                        id: 12,
                        name: 'node'
                    }
                ]
            },
            {
                id: 2,
                name: 'good'
            },
            {
                id: 3,
                name: 'sun',
                children: [
                    {
                        id: 31,
                        name: 'moon'
                    }
                ]
            }
        ];
        it('深度优先遍历所有节点', function() {
            const excepted = 'mochahellochailattenodegoodsunmoon';
            let s = '';
            traverse(tree, node => {
                s += node.name;
            })
            s.should.be.equal(excepted);
        })
    })
})