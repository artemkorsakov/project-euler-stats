# How to Display Profile Status?

This guide explains how to display the status of a user profile using the `euler-stats-profile` syntax. Follow the instructions below to retrieve and display profile information.

---

## Displaying a Profile Status

To retrieve and display the status of a specific profile, use the following format:

````
```euler-stats-profile
account=Artem_Korsakov
```
````

This will generate an image displaying the profile status:

![Profile Artem_Korsakov](https://projecteuler.net/profile/Artem_Korsakov.png)

---

## Displaying a Different Profile

If you want to display the status of another profile, simply replace the `account` value with the desired username. For example:

````
```euler-stats-profile
account=fonkost
```
````

This will display the following image:

![Profile fonkost](https://projecteuler.net/profile/fonkost.png)

---

## Handling Non-Existent Profiles

If the specified profile does not exist, the system will still attempt to display an image. For example:

````
```euler-stats-profile
account=non_existent_account
```
````

This will result in the following image being displayed:

![Profile non_existent_account](https://projecteuler.net/profile/non_existent_account.png)

---

## Handling Incorrect Configuration

If the `account` parameter is missing or incorrectly configured, an error message will be displayed. For example:

````
```euler-stats-profile
invalid=Artem_Korsakov
```
````

This will generate the following error message:

**The "account=" parameter is not set or is set incorrectly!**

---

## Summary

- Use the `account` parameter to specify the profile you want to display.
- Ensure the `account` parameter is correctly formatted to avoid errors.
- If the profile does not exist, an image will still be generated, but it may not contain valid data.
- Always check for configuration errors if the expected output is not displayed.
