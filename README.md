# M3: Node Groups & Gossip Protocols
> Full name: `<first last>`
> Email:  `<email@brown.edu>`
> Username:  `cslogin`

## Summary
> Summarize your implementation, including key challenges you encountered

My implementation comprises `7` new software components, totaling `400` added lines of code over the previous implementation. Key challenges included:
1. understanding and implementing the distinction between the local and all groups. This involved making sure the services werer properly instantiated when putting a new group into the distribution. Furthermore, making sure the all.send was properly implemented involved substantial work.
2. Configuring spawn and stop to occur properly in order for the tests to run. This involved correctly configuring the callback for the spawn function, as well as calling the server shutdown adn callback when stopping in the correct order.

## Correctness & Performance Characterization
> Describe how you characterized the correctness and performance of your implementation

*Correctness*: I wrote `5` tests; these tests take `0.728` to execute. 

*Performance*: Launching a 100 nodes takes about `<time>` seconds, and propagating a message to the entire network via gossip.send at that scale takes about `<time>` seconds — assuming the following protocol configuration: `message sending to a set of three of nodes chosen at random`.

## Key Feature
> What is the point of having a gossip protocol? Why doesn't a node just send the message to _all_ other nodes in its group?
- With many, many nodes, it becomes very expensive for one node to send a message to all other existing nodes. This also reduces the need for the single node to have knowledge of all other existing nodes in the system. Instead, a gossip protocol would allow for better and more flexible propagation of messages throughout a distributed system.

## Time to Complete
> Roughly, how many hours did this milestone take you to complete?

Hours: `15`

