# n8n-nodes-bessai

This is an [n8n](https://n8n.io/) community node for the [BESS AI](https://bess-ai.com) Call Center API.

It lets you manage AI voice agents, phone calls, batch calls, phone numbers, and analytics directly from your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-bessai` and confirm

## Credentials

You need a BESS AI API key to authenticate. Get one from the [BESS AI Dashboard](https://app.bess-ai.com).

1. Go to **Credentials > New Credential**
2. Search for **BESS AI API**
3. Enter your API key
4. Optionally change the Base URL if using a self-hosted instance

## Operations

### Agent
- **Create** — Create a new AI voice agent
- **Delete** — Delete an agent
- **Get** — Get agent details by ID
- **Get Many** — List all agents
- **Publish** — Publish an agent
- **Update** — Update agent configuration

### Call
- **Create Phone Call** — Initiate an outbound phone call
- **Create Web Call** — Create a web call session
- **End Call** — End an active call
- **Get** — Get call details by ID
- **Get Many** — List calls with filters

### Phone Number
- **Create** — Register a phone number
- **Delete** — Delete a phone number
- **Get** — Get phone number details
- **Get Many** — List all phone numbers
- **Update** — Update phone number configuration

### Batch Call
- **Create** — Create a batch call campaign
- **Get** — Get batch call details
- **Get Many** — List batch calls
- **Start** — Start a batch call
- **Pause** — Pause a running batch
- **Resume** — Resume a paused batch
- **Cancel** — Cancel a batch call

### Analytics
- **Get Summary** — Get call analytics summary
- **Get Calls by Day** — Get daily call counts

### Triggers
- **New Call Completed** — Polls for newly completed calls
- **New Batch Call Status Change** — Polls for batch call status changes

## Compatibility

- Tested with n8n v1.0+
- Requires Node.js 18+

## Resources

- [BESS AI API Documentation](https://api.bess-ai.com/docs)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
