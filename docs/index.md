# Project Euler Stats

Welcome to the official documentation for the **Project Euler Stats** plugin for Obsidian!

This plugin allows you to seamlessly integrate and display [Project Euler](https://projecteuler.net/)
profile statistics directly within your Obsidian notes.
**Project Euler Stats** allows users to track their progress in solving problems on the Project Euler platform.
By using a simple command, users can generate a detailed profile that displays their profile, progress,
tasks, awards, and friends' rankings.

---

## Features

1. **Profile Information**:
	- Displays your Project Euler account details, including username, alias, location,
	  programming language, level, and number of solved problems.

2. **Progress Overview**:
	- Shows your overall progress, including the percentage of problems solved
	  and your rankings in global, regional, and language-specific leaderboards.

3. **Tasks**:
	- Lists your current tasks, such as the number of problems remaining
	  to reach the next level or improve your rankings.

4. **Awards**:
	- Displays your progress toward earning Project Euler awards, including both completed and uncompleted awards.

5. **Friends**:
	- Compares your progress with your friends on Project Euler.

---

## Installation

1. **Install the Plugin**:

	- Open Obsidian.
	- Go to **Settings** → **Community plugins**.
	- Click **Browse** and search for "Project Euler Stats".
	- Install and enable the plugin.

2. **Configure Your Project Euler Settings**:
	- After enabling the plugin, go to **Settings** → **Project Euler Stats**.
	- Enter your `SessionId` and `Keep-Alive` cookie values in the provided fields.
	- Save the settings.

> See below section "How to remove cookies?"

---

## Usage

To display your Project Euler progress, use the following code block in your Obsidian note:

````markdown
```euler-stats

```
````

This will generate a document with your Project Euler statistics, including your profile, progress, tasks, awards, and more.

---

## Sections Explained

### Profile

This section displays your account information, including:

- **Account**: Your Project Euler username.
- **Alias**: Your display name.
- **Location**: Your geographical location.
- **Language**: The programming language you are using.
- **Level**: Your current level in Project Euler.
- **Solved**: The number of problems you have solved.

### Progress

This section provides an overview of your progress:

- **Progress**: Shows how many problems you have solved out of the total available, along with the percentage.
- **Ranking**: Displays your current ranking in various categories, such as Eulerians, by location, and by language.

### Tasks

Here, you can see your current tasks and how many problems you need to solve to reach the next level or ranking.

### Location progress

### Language progress

### Level progress

### Awards

This section lists the awards you have yet to complete, including:

- **Problem Solving Awards**: Awards related to solving problems.
- **Contributor Awards**: Awards for contributing to the Project Euler community.

### Friends

This section shows a leaderboard of your friends, including their ranks, usernames, solved problems, levels, and awards.

---

## How to extract cookies?

To retrieve cookies for a specific website from your browser, follow these steps:

### **Google Chrome**:

1. Open the website in Chrome.
2. Right-click anywhere on the page and select **Inspect** (or press `Ctrl+Shift+I` / `Cmd+Option+I`).
3. Go to the **Application** tab in the Developer Tools.
4. In the left sidebar, expand **Cookies** and select the website's domain.
5. You will see a list of cookies with their names and values.

### **Firefox**:

1. Open the website in Firefox.
2. Right-click anywhere on the page and select **Inspect Element** (or press `Ctrl+Shift+I` / `Cmd+Option+I`).
3. Go to the **Storage** tab in the Developer Tools.
4. Expand **Cookies** and select the website's domain.
5. The cookies and their values will be displayed.

### **Microsoft Edge**:

1. Open the website in Edge.
2. Right-click anywhere on the page and select **Inspect** (or press `Ctrl+Shift+I` / `Cmd+Option+I`).
3. Go to the **Application** tab in the Developer Tools.
4. Expand **Cookies** and select the website's domain.
5. View the cookies and their values.

### **Safari**:

1. Open Safari and go to the website.
2. Enable the **Develop** menu by going to **Safari** → **Preferences** → **Advanced** and checking **Show Develop menu in menu bar**.
3. From the **Develop** menu, select **Show Web Inspector** (or press `Cmd+Option+I`).
4. Go to the **Storage** tab and expand **Cookies** to view the website's cookies.

### **Using JavaScript**:

If you have access to the browser's console, you can retrieve cookies for the current site using JavaScript:

```javascript
document.cookie;
```

This will return a string of all cookies for the current domain.

### **Important Notes**:

- Cookies are domain-specific, so you can only access cookies for the site you are currently on.
- Some cookies may be marked as `HttpOnly`, meaning they cannot be accessed via JavaScript for security reasons.
- Always handle cookies responsibly and in compliance with privacy laws and regulations.

---

## Troubleshooting

- **No Data Displayed**:
	- Ensure your `SessionId` and `Keep-Alive` cookie values is correctly configured in the plugin settings.
	- Check your internet connection, as the plugin fetches data from the Project Euler website.

---

## Support

For issues or feature requests, please open an issue on the [GitHub repository](https://github.com/artemkorsakov/project-euler-obsidian-plugin).

## Conclusion

**Project Euler Stats** is a powerful tool for tracking your progress and staying motivated in solving mathematical problems.
By using the simple command `euler-stats`, you can easily generate a comprehensive report of your achievements.

---

Enjoy tracking your Project Euler progress directly in Obsidian! 🚀
