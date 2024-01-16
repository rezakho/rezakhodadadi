<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { PriorityQueue } from '@/Dijkstra';


export default defineComponent({
    name: 'Main',

    components: {},

    data()
    {
        return {
            markerStart: '',
            markerFinish: '',
            adjacencyList: {} as Record<string, Array<{node: string, weight: number}>>,
            path: [] as Array<{x1: number, y1: number, x2: number, y2: number}>
        };
    },
    mounted()
    {
        for (let x = 1; x <= 9; x++)
        {
            for (let y = 1; y <= 9; y++)
            {
                this.addVertex(String.fromCharCode(64 + x) + String.fromCharCode(64 + y));
            }
        }
        // this.addVertex('A');
        // this.addVertex('B');
        // this.addVertex('C');
        // this.addVertex('D');
        // this.addVertex('E');
        // this.addVertex('F');

        this.addEdge('AA', 'BA', 1);
        this.addEdge('BA', 'BB', 1);
        this.addEdge('BB', 'CB', 1);
        this.addEdge('CB', 'CA', 1);
        this.addEdge('CA', 'DA', 1);
        this.addEdge('DA', 'DB', 1);
        this.addEdge('BB', 'BC', 1);
        this.addEdge('BC', 'CC', 1);
        this.addEdge('DB', 'EB', 1);
        this.addEdge('EB', 'EC', 1);
        this.addEdge('EC', 'FC', 1);
        this.addEdge('FC', 'FD', 1);
        this.addEdge('FD', 'GD', 1);
        this.addEdge('GD', 'HD', 1);
        this.addEdge('HD', 'ID', 1);
        this.addEdge('ID', 'IE', 1);
        this.addEdge('ID', 'IC', 1);
        this.addEdge('IC', 'HC', 1);
        this.addEdge('CC', 'CD', 1);
        this.addEdge('DC', 'DD', 1);
        this.addEdge('CC', 'DC', 1);
        this.addEdge('ED', 'EC', 1);
        this.addEdge('DD', 'ED', 1);
        this.addEdge('CD', 'CE', 1);
        this.addEdge('CE', 'DE', 1);
        this.addEdge('DD', 'DE', 1);
        this.addEdge('DE', 'EE', 1);
        this.addEdge('ED', 'EE', 1);
        this.addEdge('EE', 'EF', 1);
        this.addEdge('EF', 'FF', 1);
        this.addEdge('FF', 'FG', 1);
        this.addEdge('FG', 'EG', 1);
        this.addEdge('EG', 'EH', 1);
        this.addEdge('EH', 'DH', 1);
        this.addEdge('DH', 'DG', 1);
        this.addEdge('DG', 'CG', 1);
        this.addEdge('CG', 'CH', 1);
        this.addEdge('CH', 'BH', 1);
        this.addEdge('BH', 'BI', 1);
        this.addEdge('DG', 'BG', 1);
        this.addEdge('BG', 'BF', 1);
        this.addEdge('BF', 'AF', 1);
        this.addEdge('AF', 'AE', 1);
        this.addEdge('AE', 'BE', 1);
        this.addEdge('BE', 'CE', 1);
        this.addEdge('CE', 'CF', 1);
        this.addEdge('CF', 'DF', 1);
        this.addEdge('DF', 'DG', 1);
        this.addEdge('EB', 'FB', 7);
        this.addEdge('FB', 'FC', 1);
        this.addEdge('GC', 'GB', 1);
        this.addEdge('GB', 'HB', 1);
        this.addEdge('HB', 'IB', 1);
        this.addEdge('GC', 'HC', 1);
        this.addEdge('FB', 'FA', 1);
        this.addEdge('FA', 'GA', 1);
        this.addEdge('GA', 'HA', 1);
        this.addEdge('HA', 'HB', 1);
        this.addEdge('FF', 'GF', 1);
        this.addEdge('GF', 'GE', 1);
        this.addEdge('GE', 'HE', 1);
        this.addEdge('HE', 'HF', 1);
        this.addEdge('HE', 'IE', 1);
        this.addEdge('FG', 'GG', 1);
        this.addEdge('GG', 'GH', 1);
        this.addEdge('GH', 'HH', 1);
        // this.addEdge('EB', 'FC', 1);
    },
    methods: {
        click(vertex: string)
        {
            if (this.markerStart === vertex)
            {
                this.markerStart = '';
            }
            else if (this.markerStart.length === 0)
            {
                this.markerStart = vertex;
            }
            else
            {
                this.markerFinish = vertex;
            }

            this.route(this.markerStart, this.markerFinish);
            console.log(this.markerStart.length, vertex, this.markerStart, this.markerFinish);
        },
        addVertex(vertex: string)
        {
            if (!this.adjacencyList[vertex])
            {
                this.adjacencyList[vertex] = [];
            }
        },
        addEdge(vertex1: string, vertex2: string, weight: number)
        {
            this.adjacencyList[vertex1].push({
                node: vertex2,
                weight
            });
            this.adjacencyList[vertex2].push({
                node: vertex1,
                weight
            });
        },
        dijkstra(start: string, finish: string)
        {
            const nodes = new PriorityQueue();
            const distances = {} as Record<string, number>;
            const previous = {} as Record<string, number | null>;
            let path = []; //to return at end
            let smallest;
            //build up initial state
            for (let vertex in this.adjacencyList)
            {
                if (vertex === start)
                {
                    distances[vertex] = 0;
                    nodes.enqueue(vertex, 0);
                }
                else
                {
                    distances[vertex] = Infinity;
                    nodes.enqueue(vertex, Infinity);
                }
                previous[vertex] = null;
            }
            // as long as there is something to visit
            while (nodes.values.length)
            {
                smallest = nodes.dequeue().val;
                if (smallest === finish)
                {
                    //WE ARE DONE
                    //BUILD UP PATH TO RETURN AT END
                    while (previous[smallest])
                    {
                        path.push(smallest);
                        smallest = previous[smallest];
                    }
                    break;
                }
                if (smallest || distances[smallest] !== Infinity)
                {
                    for (let neighbor in this.adjacencyList[smallest])
                    {
                        //find neighboring node
                        let nextNode = this.adjacencyList[smallest][neighbor];
                        //calculate new distance to neighboring node
                        let candidate = distances[smallest] + nextNode.weight;
                        let nextNeighbor = nextNode.node;
                        if (candidate < distances[nextNeighbor])
                        {
                            //updating new smallest distance to neighbor
                            distances[nextNeighbor] = candidate;
                            //updating previous - How we got to neighbor
                            previous[nextNeighbor] = smallest;
                            //enqueue in priority queue with new priority
                            nodes.enqueue(nextNeighbor, candidate);
                        }
                    }
                }
            }
            return path.concat(smallest).reverse();
        },
        route(start: string, finish: string)
        {
            const path = this.dijkstra(start, finish) as Array<string>;

            this.path = [];

            if (path.length > 1)
            {
                for (let i = 0; i < path.length - 1; i++)
                {
                    const point1 = path[i].split('').map(c => (c.charCodeAt(0) - 64) * 90);
                    const point2 = path[i + 1].split('').map(c => (c.charCodeAt(0) - 64) * 90);

                    this.path.push({
                        x1: point1[0],
                        y1: point1[1],
                        x2: point2[0],
                        y2: point2[1]
                    });
                }
            }
        }
    }
});
</script>

<template>
    <div id="main">
        <svg viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
            <g class="path">
                <template v-for="line of path">
                    <line :x1="line.x1"
                          :y1="line.y1"
                          :x2="line.x2"
                          :y2="line.y2"/>
                </template>
            </g>

            <g class="edges">
                <template v-for="(node, vertex) of adjacencyList">
                    <template v-for="edge of node">
                        <line :x1="vertex.split('').map(c => (c.charCodeAt(0) - 64) * 90)[0]"
                              :y1="vertex.split('').map(c => (c.charCodeAt(0) - 64) * 90)[1]"
                              :x2="edge.node.split('').map(c => (c.charCodeAt(0) - 64) * 90)[0]"
                              :y2="edge.node.split('').map(c => (c.charCodeAt(0) - 64) * 90)[1]"/>
                    </template>
                </template>
            </g>

            <g class="dots">
                <template v-for="x of 9">
                    <g v-for="y of 9" class="dot">
                        <circle :cx="90 * x" :cy="90 * y" r="6" class="circle"/>
                        <text :x="90 * x - 6.5" :y="90 * y + 20" class="label">{{ String.fromCharCode(64 + x) + String.fromCharCode(64 + y) }}</text>
                        <circle :cx="90 * x" :cy="90 * y" r="25" class="hint" @click="click(String.fromCharCode(64 + x) + String.fromCharCode(64 + y))"/>
                    </g>
                </template>
            </g>

            <g class="markers">
                <circle v-if="markerStart.length > 0" :cx="90 * (markerStart[0].charCodeAt(0) - 64)" :cy="90 * (markerStart[1].charCodeAt(0) - 64)" r="12" class="start"/>
                <circle v-if="markerFinish.length > 0" :cx="90 * (markerFinish[0].charCodeAt(0) - 64)" :cy="90 * (markerFinish[1].charCodeAt(0) - 64)" r="12" class="finish"/>
            </g>
        </svg>
        <div v-if="false">
            <pre>{{ adjacencyList }}
           </pre>
        </div>
    </div>
    <div>
        <template v-for="(node, vertex) of adjacencyList" v-if="false">
            <template v-for="edge of node">
                {{ vertex + vertex.split('').map(c => (c.charCodeAt(0) - 64) * 90) }}
                <br>
                {{ node }}
                <br>
                {{ edge.node.split('').map(c => (c.charCodeAt(0) - 64) * 90) }}
                <hr>
                <line :x1="vertex.split('').map(c => (c.charCodeAt(0) - 64) * 90)[0]"
                      :y1="vertex.split('').map(c => (c.charCodeAt(0) - 64) * 90)[1]"
                      :x2="edge.node.split('').map(c => (c.charCodeAt(0) - 64) * 90)[0]"
                      :y2="edge.node.split('').map(c => (c.charCodeAt(0) - 64) * 90)[1]"/>
            </template>
        </template>
    </div>
</template>

<style lang="scss">
#main
{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 100px;

    svg
    {
        border: 1px solid red;
        width: 900px;
        height: 900px;

        .edges
        {
            line
            {
                stroke: #666666;
                stroke-width: 4px;
            }
        }

        .path
        {
            animation-name: path;
            animation-duration: 2s;
            animation-iteration-count: infinite;

            line
            {
                stroke: #FF1FCB;
                stroke-width: 12px;
            }
        }

        .dots
        {
            .dot
            {
                .circle
                {
                    fill: #666666;
                }

                .label
                {
                    font-size: 11px;
                    font-family: monospace;
                    text-shadow: 1px 1px 0 #FFFFFF;
                    fill: #800E0E;
                }

                .hint
                {
                    fill: red;
                    opacity: 0;
                    cursor: pointer;
                }
            }
        }

        .markers
        {
            pointer-events: none;

            .start
            {
                fill: yellow;
            }
        }
    }

    .small
    {
        fill: blue;
        font-size: 30px;
    }

    @keyframes path
    {
        0%
        {
            opacity: .3;
        }

        50%
        {
            opacity: .6;
        }

        100%
        {
            opacity: .3;
        }
    }
}
</style>
