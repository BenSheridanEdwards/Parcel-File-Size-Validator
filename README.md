# Parcel File Size Validator
A Parcel 2 validator plugin that checks file sizes.

This validator plugin accepts all file types, and you can set limits for multiple file types within the same project.

You can configure which file types you want to set limits on, and use a range of memory unit types.

Accepted memory unit types; **KiloBytes (KB)**, **MegaBytes (MB)**, and **GigaBytes (GB)**.

Logged warnings from this plugin will be in the memory unit you specified at configuration.

## Usage

1. Install the plugin package (`parcel-validator-file-size`) as a development dependency:

```shell
npm i parcel-validator-file-size --dev
```

2. Add this plugin in your .parcelrc (if you didn't have a .parcelrc, also install `@parcel/config-default`):

```json
{
  "extends": "@parcel/config-default",
  "validators": {
    "*": ["parcel-validator-file-size", "..."]
  }
}
```

3. Specify an object of files you'd like to check the size for inside the `parcel-validator-file-size` key of `package.json`.

```json
{
  "parcel-validator-file-size": {
    "fileType": "1 MB"
  }
}
```

### Logged Warnings

When you build your project using Parcel, the validator will check all files and output warnings for all files that exceed your limits.

When a file exceeds your limit, the below warning will be logged to the console, providing useful information to help you find the file within your project:

```shell
parcel-validator-file-size: 
 Warning: File has exceeded .fileType 1 MB size limit 
 File name: example.fileType 
 File path: /source/assets/files/example.fileType 
 File size: 1.5 MB 
```

## Example

Let's say you set a 200 KB file size limit on `.png` files:

```json
{
  "parcel-validator-file-size": {
    "png": "200 KB"
  }
}
```

You run your build command, and the validator finds a .png file called *hero-desktop-header.png* that is 134.99 KB in size.

As this would exceed your 200 KB limit for .png files, the validator will output the following warning to the console:

![Screenshot 2021-05-18 at 13 20 36](https://user-images.githubusercontent.com/42347559/118649809-d689ad80-b7db-11eb-8ce6-e09951eecee4.png)

## Final Note

Thank you for using my package! I truly hope you find it useful for your projects. If you have any suggestions on how I can make this project better, please reach out to me via email at bensheridanedwards@gmail.com.
