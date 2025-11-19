# Troubleshooting Guide

## Common Issues and Solutions

### Authentication Problems

#### "Invalid token" Error

**Symptoms:**
```
❌ Authentication failed: Invalid token
💡 Try running: trello-cli-unofficial setup
```

**Solutions:**

1. **Re-run setup**:
   ```bash
   tcu setup
   ```

2. **Check token format**: Ensure your token starts with `ATTA...`

3. **Get a new token**:
   - Go to [https://trello.com/power-ups/admin](https://trello.com/power-ups/admin)
   - Create or select a Power-Up
   - Generate a new token
   - Copy the full token (it should be long)

4. **Check token expiration**: Power-Up tokens don't expire, but they can be revoked

#### "You are not authenticated" Error

**Symptoms:**
```
🔐 You are not authenticated!
```

**Solutions:**

1. **Run setup**:
   ```bash
   tcu setup
   ```

2. **Check configuration file**:
   ```bash
   cat ~/.trello-cli-unofficial/config.json
   ```

3. **Use environment variable**:
   ```bash
   export TRELLO_TOKEN=your_token_here
   tcu boards list
   ```

### Network Issues

#### "Network error" or Connection Timeout

**Symptoms:**
```
❌ Network error. Check your connection.
```

**Solutions:**

1. **Check internet connection**:
   ```bash
   ping google.com
   ```

2. **Check Trello API status**:
   - Visit [https://status.trello.com/](https://status.trello.com/)

3. **Try with different network** (if possible)

4. **Check firewall/proxy settings**

5. **Wait and retry**: API rate limits or temporary issues

#### API Rate Limiting

**Symptoms:**
```
❌ API Error (429): Rate limit exceeded
```

**Solutions:**

1. **Wait before retrying**: Rate limits reset every 10 seconds
2. **Reduce request frequency**: Avoid rapid successive commands
3. **Use batch operations** when available (future feature)

### Command Issues

#### "Command not found" Error

**Symptoms:**
```
tcu: command not found
```

**Solutions:**

1. **Check installation**:
   ```bash
   npm list -g trello-cli-unofficial
   ```

2. **Reinstall**:
   ```bash
   npm uninstall -g trello-cli-unofficial
   npm install -g trello-cli-unofficial
   ```

3. **Check PATH**:
   ```bash
   echo $PATH
   which tcu
   ```

4. **Try full command name**:
   ```bash
   trello-cli-unofficial --version
   ```

#### "Board/List/Card not found" Errors

**Symptoms:**
```
❌ Board with ID "xxx" not found
```

**Solutions:**

1. **Verify ID format**: IDs should be 24-character hexadecimal strings

2. **Check if resource exists**:
   ```bash
   # List boards
   tcu boards list

   # List lists in a board
   tcu lists list <boardId>

   # List cards in a list
   tcu cards list <listId>
   ```

3. **Check permissions**: Ensure you have access to the resource

4. **Use correct ID**: Copy the exact ID from list commands

### Performance Issues

#### Slow CLI Response

**Symptoms:**
- Commands take longer than expected
- CLI feels sluggish

**Solutions:**

1. **Ensure Bun is installed**:
   ```bash
   bun --version
   ```

2. **Update Bun**:
   ```bash
   bun upgrade
   ```

3. **Clear caches**:
   ```bash
   bun pm cache rm
   npm cache clean --force
   ```

4. **Check system resources**: Close other memory-intensive applications

### Platform-Specific Issues

#### Windows Issues

**Common problems:**
- PATH not updated after installation
- Permission errors
- Line ending issues

**Solutions:**

1. **Restart terminal/command prompt** after installation

2. **Run as administrator** for installation:
   ```powershell
   npm install -g trello-cli-unofficial
   ```

3. **Check Windows PATH**:
   - Open System Properties → Advanced → Environment Variables
   - Ensure npm global bin directory is in PATH

#### Linux/macOS Issues

**Common problems:**
- Permission errors during installation
- Missing dependencies

**Solutions:**

1. **Use sudo for global installation** (not recommended):
   ```bash
   sudo npm install -g trello-cli-unofficial
   ```

2. **Install without sudo** (recommended):
   ```bash
   npm config set prefix ~/.npm-global
   export PATH=~/.npm-global/bin:$PATH
   npm install -g trello-cli-unofficial
   ```

3. **Check permissions**:
   ```bash
   ls -la ~/.trello-cli-unofficial/
   ```

### Configuration Issues

#### Configuration File Problems

**Symptoms:**
- Settings not saved
- Configuration ignored

**Solutions:**

1. **Check file permissions**:
   ```bash
   ls -la ~/.trello-cli-unofficial/config.json
   ```

2. **Check file content**:
   ```bash
   cat ~/.trello-cli-unofficial/config.json
   ```

3. **Reset configuration**:
   ```bash
   rm ~/.trello-cli-unofficial/config.json
   tcu setup
   ```

4. **Use environment variables** instead:
   ```bash
   export TRELLO_TOKEN=your_token
   export TRELLO_API_KEY=your_api_key
   ```

### Internationalization Issues

#### Wrong Language Displayed

**Symptoms:**
- Messages in wrong language
- Mixed languages

**Solutions:**

1. **Check system language**:
   ```bash
   echo $LANG
   locale
   ```

2. **Force language**:
   ```bash
   LANG=pt_BR.UTF-8 tcu
   LANG=en_US.UTF-8 tcu
   ```

3. **Check available locales**:
   ```bash
   locale -a
   ```

### Development Issues

#### Build/Test Failures

**Symptoms:**
- `bun test` fails
- `bun run validate` fails

**Solutions:**

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Clear node_modules**:
   ```bash
   rm -rf node_modules
   bun install
   ```

3. **Check Bun version**:
   ```bash
   bun --version
   # Should be 1.0.0 or higher
   ```

4. **Run individual tests**:
   ```bash
   bun test tests/unit/
   bun test tests/integration/
   ```

### Getting Help

If none of these solutions work:

1. **Check GitHub Issues**: [Search existing issues](https://github.com/JaegerCaiser/trello-cli-unofficial/issues)

2. **Create a new issue**: Include:
   - Your OS and version
   - Node.js and Bun versions
   - Full error message
   - Steps to reproduce

3. **Include debug information**:
   ```bash
   tcu --version
   bun --version
   node --version
   echo $LANG
   cat ~/.trello-cli-unofficial/config.json
   ```

### Emergency Commands

If everything fails, try these emergency measures:

1. **Complete reset**:
   ```bash
   # Remove everything
   npm uninstall -g trello-cli-unofficial
   rm -rf ~/.trello-cli-unofficial/
   rm -rf node_modules/
   npm cache clean --force

   # Fresh install
   npm install -g trello-cli-unofficial
   tcu setup
   ```

2. **Use development version**:
   ```bash
   git clone https://github.com/JaegerCaiser/trello-cli-unofficial.git
   cd trello-cli-unofficial
   bun install
   bun link
   ```

3. **Manual API calls** (last resort):
   Use curl or Postman to test Trello API directly with your credentials.</content>
<parameter name="filePath">/home/matheus/Desenvolvimento/personal/trello-cli-unofficial/docs/troubleshooting.md