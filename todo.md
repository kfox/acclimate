### Tests

* add tests for commands

### Paths

* use/show api path by default, use json response keys if first character is
  a dot, e.g. from /studios: cd .studios[0].videos
* use/show friendly names if enabled

### Centralize Requests

* autocomplete paths
* add: post, put, patch, head, delete, options, trace
* options
  - type (content type) (default: 'json')
  - headers
  - query
  - attachments
  - fields

### API Mapping

* add paths to auto-completion after successful http method commands

### Authentication

* auth failures should automatically invoke the "login" command

### Remote Config

If present:

* merge mappings from endpoint, /acclimate/mappings
* merge commands from endpoint, /acclimate/commands
* merge site configuration from endpoint, /acclimate/config

All responses should be json. These endpoints should be queried at the
following times:

* before authentication
* after successful authentication
* after successful authentication as a different user

### Other commands to add or change

* help|? (reorder commands?)

* session
  - load <name>
  - save <name>
  - rename <name>
  - makedefault
  - token [token]

* alias
  - add|set <name> <command> [| <command>...]
  - remove|rm|unset <name>
  - show|list|ls

* config (may be overridden by a site config)
  - unique_id <string> (default: 'uid')
  - friendly_name_attribute <string> (default: 'name')
  - show_friendly_names <boolean> (default true)
  - show_file_progress <boolean> (default: true)
  - prompt_for_remote_mappings <boolean> (default: true)
  - prompt_for_remote_commands <boolean> (default: true)
  - prompt_to_load_session <boolean> (default: true)
  - cache_all_responses <boolean> (default: true)
  - path_display <actual, friendly, json> (default: actual)

* files (autocompletes filenames)
  - add <files>
  - remove|rm <files>
  - show|list|ls

* man|doc|documentation <query> (if available)

* z|find <query> (searches api map and known values)

* login|user|username [username]
  - move this to external api endpoint

* tree|map <path>

* name <newname> (sets a custom friendly name)
  - --remove option
