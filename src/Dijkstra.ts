//Dijkstra algorithm is used to find the shortest distance between two nodes inside a valid weighted graph. Often used in Google Maps, Network Router etc.

//helper class for PriorityQueue
class DNode
{
    private val: string;

    private priority: number;


    constructor(val: string, priority: number)
    {
        this.val = val;
        this.priority = priority;
    }
}

class PriorityQueue
{
    public values: any[];


    constructor()
    {
        this.values = [];
    }


    enqueue(val: string, priority: number)
    {
        let newNode = new DNode(val, priority);
        this.values.push(newNode);
        this.bubbleUp();
    }


    bubbleUp()
    {
        let idx = this.values.length - 1;
        const element = this.values[idx];
        while (idx > 0)
        {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.values[parentIdx];
            if (element.priority >= parent.priority)
            {
                break;
            }
            this.values[parentIdx] = element;
            this.values[idx] = parent;
            idx = parentIdx;
        }
    }


    dequeue()
    {
        const min = this.values[0];
        const end = this.values.pop();
        if (this.values.length > 0)
        {
            this.values[0] = end;
            this.sinkDown();
        }
        return min;
    }


    sinkDown()
    {
        let idx = 0;
        const length = this.values.length;
        const element = this.values[0];
        while (true)
        {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIdx < length)
            {
                leftChild = this.values[leftChildIdx];
                if (leftChild.priority < element.priority)
                {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length)
            {
                rightChild = this.values[rightChildIdx];
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)
                )
                {
                    swap = rightChildIdx;
                }
            }
            if (swap === null)
            {
                break;
            }
            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;
        }
    }
}

export { DNode, PriorityQueue };