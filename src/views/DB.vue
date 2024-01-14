<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { PriorityQueue } from '@/Dijkstra';
import { types } from 'sass';


export default defineComponent({
    name: 'DB',

    components: {},

    data()
    {
        return {
            q: 'r1(x),w2(x),r1(y),c1,w2(x),c2,r4(x)',
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
                console.log(transactionNames);
            },
            immediate: true
        }
    },

    mounted()
    {
    },

    methods: {
        test()
        {
            return /^([rw]\d+\([a-z]\)|[ac]\d+)(,([rw]\d+\([a-z]\)|[ac]\d+))*$/i.test(this.q);
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
                <td v-for="commands of transaction[1]">{{ commands }}</td>
            </tr>
        </table>
    </div>
</template>

<style lang="scss" scoped>
#db
{
    padding: 40px;

    .q
    {
        text-align: center;
        margin-bottom: 150px;

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
                background-color: #f6d3c6;
            }
        }
    }

    .table
    {
        border-collapse: collapse;
        font-family: monospace;
        font-size: 17px;
        text-transform: lowercase;

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
}
</style>
