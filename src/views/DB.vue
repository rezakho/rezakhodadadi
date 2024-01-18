<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { PriorityQueue } from '@/Dijkstra';
import { types } from 'sass';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';


export default defineComponent({
    name: 'DB',

    components: {},

    data()
    {
        return {
            q: 'r1(x),w2(x),r1(y),r2(y),c1,w2(x),w3(x),w4(o),w1(o),c2,r4(x)',
            query: '',
            // transactions: [] as Array<{name: string, commands: Array<string>}>,
            transactions: new Map<string, Array<string>>(),
            markerFinish: '',
            adjacencyList: {} as Map<string, Array<{node: string, weight: number}>>,
            path: [] as Array<{x1: number, y1: number, x2: number, y2: number}>
        };
    },

    computed: {
        commands()
        {
            this.q.split(',');
        }
    },

    watch: {
        'q': {
            handler()
            {
                if (this.test())
                {
                    this.query = this.q.toLowerCase();
                }
            },
            immediate: true
        },
        'query': {
            handler()
            {
                const transactionNames = [...this.q.matchAll(/[rwac](\d+)/g)]
                    .map(x => x[1])
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .sort();

                const commands = [...this.query.matchAll(/[rw](\d+)\([a-z]\)|[ac](\d+)/g)];

                console.log(commands);
                console.log(this.transactions);

                this.transactions.clear();

                for (let command of commands)
                {
                    for (let transactionName of transactionNames)
                    {
                        if (!this.transactions.has(transactionName))
                        {
                            this.transactions.set(transactionName, []);
                        }

                        this.transactions.get(transactionName)?.push((transactionName === command[1] || transactionName === command[2]) ? command[0] : '');
                    }

                    // for (let c of [...this.query.matchAll(new RegExp(`[rw]\\d+\\([a-z]\\)|[ac]\\d+`))])
                    // {
                    //     commands.push()
                    // }

                    // this.transactions['1'];
                }

                // if (transactionNames.length)
                // {
                //
                // }
                // this.commands
                console.log([...this.transactions]);


                this.drawGraph();
            },
            immediate: true
        }
    },

    mounted()
    {
        this.drawGraph();
    },

    methods: {
        test()
        {
            return /^([rw]\d+\([a-z]\)|[ac]\d+)(,([rw]\d+\([a-z]\)|[ac]\d+))*$/i.test(this.q);
        },

        edgeExists(edges: Array<{from: string, to: string}>, from: string, to: string)
        {
            return !!edges.find(e => e.from === from && e.to === to);
        },

        drawGraph()
        {
            const nodes = [];
            const edges = [];

            for (let transaction of this.transactions)
            {
                nodes.push({
                    id: 't' + transaction[0],
                    label: 't' + transaction[0]
                });
            }

            // add edges
            for (let transactionA of this.transactions)
            {
                for (let transactionB of this.transactions)
                {
                    if (transactionA[0] === transactionB[0])
                    {
                        continue;
                    }

                    for (let a = 0; a < transactionA[1].length; a++)
                    {
                        for (let b = a; b < transactionB[1].length; b++)
                        {
                            const commandA = transactionA[1][a];
                            const commandB = transactionB[1][b];

                            if (commandA.startsWith('a') || commandA.startsWith('c') || commandB.startsWith('a') || commandB.startsWith('c'))
                            {
                                continue;
                            }

                            const dataA = transactionA[1][a].substring(transactionA[1][a].indexOf('(') + 1, transactionA[1][a].indexOf(')'));
                            const dataB = transactionB[1][b].substring(transactionB[1][b].indexOf('(') + 1, transactionB[1][b].indexOf(')'));

                            console.log(dataA, '-', dataB);

                            if ((dataA === dataB) && commandA.startsWith('r') && commandB.startsWith('w') && !this.edgeExists(edges, 't' + transactionA[0], 't' + transactionB[0]))
                            {
                                edges.push({
                                    from: 't' + transactionA[0],
                                    to: 't' + transactionB[0]
                                });

                                // console.log(commandA, '-', commandB);
                            }

                            if ((dataA === dataB) && commandA.startsWith('w') && (commandB.startsWith('r') || commandB.startsWith('w')) && !this.edgeExists(edges, 't' + transactionA[0], 't' + transactionB[0]))
                            {
                                edges.push({
                                    from: 't' + transactionA[0],
                                    to: 't' + transactionB[0]
                                });

                                // console.log(commandA, '-', commandB);
                            }

                            // console.log(commandA, '-', commandB);
                        }
                        // if (edges.find(e => e.from ===))
                    }
                }
            }

            console.log(edges);

            var visNodes = new DataSet(nodes);

            // create an array with edges
            // @ts-ignore
            var visEdges = new DataSet(edges);

            // create a network
            var container = document.getElementById('mynetwork');
            var data = {
                nodes: nodes,
                edges: edges
            };
            var options = {
                height: '800',

                interaction: {
                    zoomView: false
                },

                edges: {
                    arrows: {
                        to: {
                            enabled: true
                        }
                    },
                    color: {
                        color: '#000000'
                    },
                    width: 2,
                    length: 250,
                    physics: true
                },

                nodes: {
                    heightConstraint: 50,
                    shape: 'circle',
                    physics: false,
                    font: {
                        face: 'monospace',
                        size: 17,
                        align: 'center'
                    }
                }
            };

            if (this.$refs.graph)
            {
                var network = new Network(this.$refs.graph as HTMLElement, data, options);
            }
        }
    }
});
</script>

<template>
    <div id="db">
        <div class="q">
            <input v-model="q" :class="{error: !test()}">
        </div>

        <div v-if="false">
            <div>{{ query }}</div>
            <div>{{ test() }}</div>
            <pre>{{ transactions }}</pre>
        </div>

        <table class="table">
            <tr v-for="transaction of transactions">
                <td>T<sub>{{ transaction[0] }}</sub></td>
                <td v-for="command of transaction[1]">{{ command }}</td>
            </tr>
        </table>

        <div class="graph">
            <div class="note">گره ها قابل جابجایی هستند</div>
            <div class="canvas" ref="graph"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#db
{
    padding: 40px;

    .q
    {
        text-align: center;
        margin-bottom: 80px;

        input
        {
            width: 80vw;
            height: 80px;
            text-transform: lowercase;
            font-family: monospace;
            border: 5px solid #5388EF;
            border-radius: 10px;
            font-size: 17px;
            padding: 5px 10px;
            outline: none;

            &.error
            {
                border-color: orangered;
                background-color: #F6D3C6;
            }
        }
    }

    .table
    {
        border-collapse: collapse;
        font-family: monospace;
        font-size: 17px;
        text-transform: lowercase;
        margin-bottom: 80px;

        tr
        {
            td
            {
                border-bottom: 3px solid #000000;
                padding: 10px 0;
                width: 80px;
                text-align: center;
                border-right: 2px dashed #DDDDDD;

                &:nth-child(1)
                {
                    border-right: 3px solid #000000;
                }

                &:nth-last-child(1)
                {
                    border-right: none;
                }
            }

            &:nth-last-child(1)
            {
                td
                {
                    border-bottom: 0;
                }
            }
        }
    }

    .graph
    {
        border: 2px solid #CBCBCB;
        border-radius: 20px;

        .note
        {
            text-align: center;
            direction: rtl;
            padding: 10px;
            user-select: none;
        }

        .canvas
        {
            height: 100%;
        }
    }
}
</style>
