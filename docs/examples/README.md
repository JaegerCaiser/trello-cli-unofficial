# Trello CLI Examples

This directory contains practical examples of using Trello CLI Unofficial for common workflows.

## Basic Usage Examples

### 1. Daily Standup - Create Cards for Team Tasks

```bash
#!/bin/bash
# daily-standup.sh - Create cards for daily tasks

# Get the board ID for "Development Board"
BOARD_ID=$(tcu boards list --format json | jq -r '.[] | select(.name == "Development Board") | .id')

# Get the "To Do" list ID
TODO_LIST_ID=$(tcu lists list $BOARD_ID --format json | jq -r '.[] | select(.name == "To Do") | .id')

# Create daily task cards
tcu cards create $TODO_LIST_ID "Review pull requests" --desc "Review and approve pending PRs"
tcu cards create $TODO_LIST_ID "Update documentation" --desc "Update API docs for new endpoints"
tcu cards create $TODO_LIST_ID "Fix authentication bug" --desc "Fix token refresh issue in login flow"

echo "✅ Daily standup cards created!"
```

### 2. Sprint Planning - Bulk Card Creation

```bash
#!/bin/bash
# sprint-planning.sh - Create cards from a sprint backlog

# Configuration
BOARD_NAME="Product Development"
SPRINT_NAME="Sprint 25"
BACKLOG_FILE="sprint-25-backlog.txt"

# Get IDs
BOARD_ID=$(tcu boards list --format json | jq -r ".[] | select(.name == \"$BOARD_NAME\") | .id")
BACKLOG_LIST_ID=$(tcu lists list $BOARD_ID --format json | jq -r '.[] | select(.name == "Product Backlog") | .id')

# Read backlog file and create cards
while IFS= read -r line; do
    if [[ ! -z "$line" && ! "$line" =~ ^# ]]; then
        TITLE=$(echo "$line" | cut -d'|' -f1)
        DESC=$(echo "$line" | cut -d'|' -f2)
        tcu cards create "$BACKLOG_LIST_ID" "$TITLE" --desc "$DESC"
    fi
done < "$BACKLOG_FILE"

echo "✅ Sprint planning cards created from $BACKLOG_FILE"
```

### 3. Sprint Review - Export Sprint Data

```bash
#!/bin/bash
# sprint-review.sh - Export sprint data for review

# Configuration
BOARD_NAME="Development Board"
SPRINT_NUMBER="25"
OUTPUT_DIR="./sprint-$SPRINT_NUMBER-review"

mkdir -p "$OUTPUT_DIR"

# Get board info
BOARD_ID=$(tcu boards list --format json | jq -r ".[] | select(.name == \"$BOARD_NAME\") | .id")

# Export all lists
tcu lists list $BOARD_ID --format json > "$OUTPUT_DIR/lists.json"

# Export cards from each list
tcu lists list $BOARD_ID --format json | jq -r '.[].id' | while read list_id; do
    LIST_NAME=$(tcu lists list $BOARD_ID --format json | jq -r ".[] | select(.id == \"$list_id\") | .name" | tr ' ' '-')
    tcu cards list $list_id --format json > "$OUTPUT_DIR/cards-$LIST_NAME.json"
done

# Generate summary report
echo "# Sprint $SPRINT_NUMBER Review Report" > "$OUTPUT_DIR/README.md"
echo "" >> "$OUTPUT_DIR/README.md"
echo "## Board: $BOARD_NAME" >> "$OUTPUT_DIR/README.md"
echo "" >> "$OUTPUT_DIR/README.md"

tcu lists list $BOARD_ID --format json | jq -r '.[] | "- \(.name): \(.cards | length) cards"' >> "$OUTPUT_DIR/README.md"

echo "✅ Sprint review data exported to $OUTPUT_DIR/"
```

## Advanced Examples

### 4. Board Health Check

```bash
#!/bin/bash
# board-health-check.sh - Analyze board health metrics

BOARD_ID="$1"

if [ -z "$BOARD_ID" ]; then
    echo "Usage: $0 <board-id>"
    echo "Available boards:"
    tcu boards list
    exit 1
fi

echo "🔍 Analyzing board health..."
echo

# Board overview
echo "📋 Board Details:"
tcu boards show $BOARD_ID
echo

# List statistics
echo "📊 List Statistics:"
tcu lists list $BOARD_ID --format json | jq -r '.[] | "\(.name): \(.cards | length) cards"'
echo

# Cards without descriptions
echo "⚠️  Cards without descriptions:"
tcu lists list $BOARD_ID --format json | jq -r '.[].id' | while read list_id; do
    tcu cards list $list_id --format json | jq -r '.[] | select(.desc == null or .desc == "") | "  - \(.name) (ID: \(.id))"'
done
echo

# Cards without due dates (if applicable)
echo "📅 Cards without due dates:"
tcu lists list $BOARD_ID --format json | jq -r '.[].id' | while read list_id; do
    tcu cards list $list_id --format json | jq -r '.[] | select(.due == null) | "  - \(.name)"'
done

echo "✅ Board health check complete!"
```

### 5. Automated Card Management

```bash
#!/bin/bash
# auto-manage-cards.sh - Automated card lifecycle management

# Configuration
BOARD_NAME="Development Board"
DONE_LIST_NAME="Done"
ARCHIVE_THRESHOLD_DAYS=30

# Get IDs
BOARD_ID=$(tcu boards list --format json | jq -r ".[] | select(.name == \"$BOARD_NAME\") | .id")
DONE_LIST_ID=$(tcu lists list $BOARD_ID --format json | jq -r ".[] | select(.name == \"$DONE_LIST_NAME\") | .id")

# Find cards older than threshold
echo "🗂️  Archiving old completed cards..."

tcu cards list $DONE_LIST_ID --format json | jq -r ".[] | select(.dateLastActivity) | @base64" | while read card_data; do
    CARD_DATA=$(echo "$card_data" | base64 --decode)
    CARD_ID=$(echo "$CARD_DATA" | jq -r '.id')
    CARD_NAME=$(echo "$CARD_DATA" | jq -r '.name')
    LAST_ACTIVITY=$(echo "$CARD_DATA" | jq -r '.dateLastActivity')

    # Calculate days since last activity
    DAYS_AGO=$(( ($(date +%s) - $(date -d "$LAST_ACTIVITY" +%s)) / 86400 ))

    if [ $DAYS_AGO -gt $ARCHIVE_THRESHOLD_DAYS ]; then
        echo "  Archiving: $CARD_NAME (last activity: $DAYS_AGO days ago)"
        # Note: Trello API has archive functionality, but this CLI doesn't implement it yet
        # tcu cards archive $CARD_ID
    fi
done

echo "✅ Card management complete!"
```

### 6. Team Productivity Report

```bash
#!/bin/bash
# productivity-report.sh - Generate team productivity metrics

BOARD_NAME="Development Board"
REPORT_PERIOD="7" # days

# Get board data
BOARD_ID=$(tcu boards list --format json | jq -r ".[] | select(.name == \"$BOARD_NAME\") | .id")

echo "📊 Productivity Report - Last $REPORT_PERIOD days"
echo "Board: $BOARD_NAME"
echo "Period: $(date -d "$REPORT_PERIOD days ago" +%Y-%m-%d) to $(date +%Y-%m-%d)"
echo

# Cards created
CARDS_CREATED=$(tcu lists list $BOARD_ID --format json | jq -r '.[].id' | while read list_id; do
    tcu cards list $list_id --format json | jq -r ".[] | select(.dateLastActivity) | select(.dateLastActivity > \"$(date -d "$REPORT_PERIOD days ago" +%Y-%m-%d)\") | .id"
done | wc -l)

echo "📈 Cards Created: $CARDS_CREATED"

# Cards completed (moved to Done)
DONE_LIST_ID=$(tcu lists list $BOARD_ID --format json | jq -r '.[] | select(.name == "Done" or .name == "Concluído") | .id')
if [ ! -z "$DONE_LIST_ID" ]; then
    CARDS_COMPLETED=$(tcu cards list $DONE_LIST_ID --format json | jq -r ".[] | select(.dateLastActivity > \"$(date -d "$REPORT_PERIOD days ago" +%Y-%m-%d)\") | .id" | wc -l)
    echo "✅ Cards Completed: $CARDS_COMPLETED"
fi

# Active cards
ACTIVE_CARDS=$(tcu lists list $BOARD_ID --format json | jq -r '.[].id' | while read list_id; do
    LIST_NAME=$(tcu lists list $BOARD_ID --format json | jq -r ".[] | select(.id == \"$list_id\") | .name")
    if [[ "$LIST_NAME" != "Done" && "$LIST_NAME" != "Concluído" && "$LIST_NAME" != "Backlog" ]]; then
        tcu cards list $list_id --format json | jq -r '.[].id'
    fi
done | wc -l)

echo "🔄 Active Cards: $ACTIVE_CARDS"

echo
echo "📋 List Breakdown:"
tcu lists list $BOARD_ID --format json | jq -r '.[] | "- \(.name): \(.cards | length) cards"'

echo
echo "✅ Report generated successfully!"
```

## CI/CD Integration Examples

### 7. GitHub Actions - Automated Card Creation

```yaml
# .github/workflows/create-issue-card.yml
name: Create Trello Card for Issues

on:
  issues:
    types: [opened, labeled]

jobs:
  create-card:
    runs-on: ubuntu-latest
    if: contains(github.event.issue.labels.*.name, 'trello-card')
    steps:
      - name: Create Trello Card
        run: |
          # Install Trello CLI
          npm install -g trello-cli-unofficial

          # Configure token (use secrets)
          export TRELLO_TOKEN=${{ secrets.TRELLO_TOKEN }}

          # Get board and list IDs
          BOARD_ID=$(tcu boards list --format json | jq -r '.[] | select(.name == "Development Board") | .id')
          BACKLOG_ID=$(tcu lists list $BOARD_ID --format json | jq -r '.[] | select(.name == "Backlog") | .id')

          # Create card
          tcu cards create $BACKLOG_ID "${{ github.event.issue.title }}" \
            --desc "Issue: ${{ github.event.issue.html_url }}\n\n${{ github.event.issue.body }}"
```

### 8. Automated Sprint Closure

```bash
#!/bin/bash
# close-sprint.sh - Automate sprint closure tasks

SPRINT_NUMBER="$1"
NEXT_SPRINT=$((SPRINT_NUMBER + 1))

if [ -z "$SPRINT_NUMBER" ]; then
    echo "Usage: $0 <sprint-number>"
    exit 1
fi

echo "🏁 Closing Sprint $SPRINT_NUMBER..."

# Get board and list IDs
BOARD_ID=$(tcu boards list --format json | jq -r '.[] | select(.name == "Development Board") | .id')
DONE_LIST_ID=$(tcu lists list $BOARD_ID --format json | jq -r '.[] | select(.name == "Done") | .id')
BACKLOG_LIST_ID=$(tcu lists list $BOARD_ID --format json | jq -r '.[] | select(.name == "Product Backlog") | .id')

# Create sprint review card
tcu cards create $DONE_LIST_ID "Sprint $SPRINT_NUMBER Retrospective" \
  --desc "Conduct sprint retrospective meeting\n- What went well?\n- What could be improved?\n- Action items for next sprint"

# Create next sprint planning card
tcu cards create $BACKLOG_LIST_ID "Sprint $NEXT_SPRINT Planning" \
  --desc "Plan Sprint $NEXT_SPRINT\n- Review backlog\n- Estimate stories\n- Commit to sprint goal"

# Archive completed cards (if archiving was implemented)
# tcu cards archive-batch $DONE_LIST_ID --older-than 30days

echo "✅ Sprint $SPRINT_NUMBER closed! Sprint $NEXT_SPRINT planning initiated."
```

## Tips for Effective Usage

1. **Use JSON format for scripting**: `--format json` with `jq` for powerful automation
2. **Store IDs in variables**: Avoid hardcoding IDs in scripts
3. **Use environment variables**: Keep tokens secure in CI/CD
4. **Combine with other tools**: Integrate with GitHub Actions, Slack, etc.
5. **Create templates**: Build reusable scripts for common workflows
6. **Monitor API limits**: Space out automated requests
7. **Use descriptive names**: Make cards easy to find and manage
8. **Regular cleanup**: Archive old completed cards periodically</content>
<parameter name="filePath">/home/matheus/Desenvolvimento/personal/trello-cli-unofficial/docs/examples/README.md