# Project Euler Stats

This repository contains an Obsidian plugin that allows users to automatically fetch and display statistics 
from the [Project Euler](https://projecteuler.net/) website. 
The plugin integrates seamlessly with Obsidian, providing a convenient way 
to track your Project Euler problem-solving progress directly within your personal knowledge base.

This plugin is perfect for math and programming enthusiasts 
who want to track their Project Euler achievements directly in Obsidian, 
integrating them with other knowledge and notes.

### Key Features:

1. **Automatic Statistics Fetching:**

	- The plugin connects to your Project Euler account or uses data parsing to retrieve information 
      about solved problems, progress, and other metrics.

2. **Display Statistics in Obsidian:**

	- The fetched data is displayed as tables, graphs, or text blocks that can be embedded directly into your notes.

3. **Data Synchronization:**

	- The plugin can automatically update statistics when Obsidian is opened or upon user request.

4. **Customization:**

	- Users can customize which data to display (e.g., number of solved problems, 
      progress by difficulty level, recently solved problems, etc.).

5. **Integration with Notes:**
	- The plugin allows you to link solved problems to your Obsidian notes, creating cross-references for easier navigation.

### How to Use:

1. Install the plugin via Community Plugins in Obsidian.
2. Configure the plugin by providing access details for your Project Euler account.
3. Use the plugin commands to fetch and display statistics in your notes.

### Example Usage:

````markdown
## Project Euler Statistics

```euler-stats-profile
account=Artem_Korsakov
```
````

This code block will display your progress, a list of solved problems, and a progress graph.

![Profile Artem_Korsakov](https://projecteuler.net/profile/Artem_Korsakov.png)

For more detailed information, please refer to [the documentation]().

### Installation:

1. Go to Obsidian settings.
2. Open the "Community Plugins" tab.
3. Search for the "Project Euler Stats" plugin and install it.
4. Activate the plugin and configure it according to your preferences.

### Requirements:

- Obsidian version 0.15.0 or higher.
- A Project Euler account.

### License:

This plugin is distributed under the MIT License. You are free to use, modify, and distribute it.

### Contributing:

We welcome contributions from the community! If you'd like to add new features, fix bugs, or improve documentation, 
feel free to create a pull request or open an issue in the repository.
