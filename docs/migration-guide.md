# Migration Guide

## Overview

This guide helps you migrate from older versions of Trello CLI Unofficial to the latest version with new commands and features.

## Version Changes

### v0.11.0 → v0.12.0

#### New Commands Structure

The CLI now uses a more organized command structure with subcommands:

```bash
# Old way (deprecated)
tcu boards                    # Still works but deprecated
tcu lists <boardName>         # Still works but deprecated
tcu cards <boardName> <listName> # Still works but deprecated

# New way (recommended)
tcu boards list               # List all boards
tcu lists list <boardId>      # List lists in a board
tcu cards list <listId>       # List cards in a list
tcu boards show <boardId>     # Show board details
tcu cards show <cardId>       # Show card details
```

#### New Features

- **Board Details**: `tcu boards show <boardId>` shows members, labels, and statistics
- **Card Details**: `tcu cards show <cardId>` shows checklists, members, labels, and attachments
- **Output Formats**: All commands support `--format table|json|csv`
- **Enhanced Error Handling**: Better error messages and validation

#### Migration Steps

1. **Update your scripts**:
   ```bash
   # Replace old commands
   tcu boards → tcu boards list
   tcu lists <boardName> → tcu lists list <boardId>
   tcu cards <boardName> <listName> → tcu cards list <listId>
   ```

2. **Get board/list IDs**:
   ```bash
   # List boards to get IDs
   tcu boards list

   # List lists in a board to get list IDs
   tcu lists list <boardId>
   ```

3. **Use new features**:
   ```bash
   # Show detailed board information
   tcu boards show <boardId>

   # Show detailed card information
   tcu cards show <cardId>

   # Export data in different formats
   tcu boards list --format json
   tcu cards list <listId> --format csv
   ```

#### Backward Compatibility

All old commands are still supported but will show deprecation warnings. They will be removed in a future major version.

### Configuration Changes

No configuration changes are required. Your existing `~/.trello-cli-unofficial/config.json` file will continue to work.

### Breaking Changes

None in this version. All changes are backward compatible.

## Troubleshooting

### Command Not Found Errors

If you get "command not found" errors after updating:

1. **Reinstall the CLI**:
   ```bash
   npm uninstall -g trello-cli-unofficial
   npm install -g trello-cli-unofficial
   ```

2. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

3. **Check your PATH**:
   ```bash
   which tcu
   echo $PATH
   ```

### Authentication Issues

If you experience authentication issues after updating:

1. **Re-run setup**:
   ```bash
   tcu setup
   ```

2. **Check your token**:
   ```bash
   tcu config
   ```

3. **Verify token format**: Make sure your token starts with `ATTA...`

### Performance Issues

If you notice slower performance:

1. **Ensure Bun is installed**: The CLI requires Bun for optimal performance
2. **Update Bun**: `bun upgrade`
3. **Clear Bun cache**: `bun pm cache rm`

## Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/JaegerCaiser/trello-cli-unofficial/issues)
- **Documentation**: Check the main README.md for detailed usage examples
- **Examples**: See `docs/examples/` for practical usage examples

## Version History

- **v0.12.0**: New command structure, board/card details, output formats
- **v0.11.0**: Enhanced error handling and validation
- **v0.10.0**: Initial public release with basic CRUD operations</content>
<parameter name="filePath">/home/matheus/Desenvolvimento/personal/trello-cli-unofficial/docs/migration-guide.md