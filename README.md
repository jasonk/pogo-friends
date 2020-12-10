# Pokemon Go Friend Maker #

> Make new friends in Pokemon Go faster than ever!  I added 130
> friends in the last 2 hours.

## How it works ##

This tool consists of a number of scripts, the most important one is
called `make-friends`.  What `make-friends` does it to read Pokemon Go
Trainer Codes from a file named `new.txt`.  For each code it finds in
the file it will first check to see if it appears in the file
`did.txt`.  If it appears in `did.txt` then that means it's
a duplicate, and it gets ignored.  If it doesn't appear in `did.txt`
then it's a new friend code you haven't seen before, so `make-friends`
will show you the QR code for that friend code.  All you have to do is
to open Pokemon Go on your phone, go to `Add Friend`, click on the `QR
Code` tab, then point your camera at the QR code on the screen.  Once
it has detected the code it'll tell you what happpened.  Once that's
done you just hit any key (except for `ctrl-C`, which tells
`make-friends` to quit) and the QR for the next friend code in the
list will be displayed.

Then you just keep repeating that:
 * `Add Friend`
 * `QR Code`
 * Point camera at code
 * Hit any key... repeat until you run out of codes or get tired.

## Where to find Trainer Codes ##

You could just ask people for trainer codes and add them to the
`new.txt` file, but there is an easier way!  In this directory you
will also find some scripts that have names starting with `scan-`,
these look in different places on the internet where you might find
recently posted Trainer Codes and adds any that it finds to your
`new.txt` file automatically.

Scanners currently available include:

- `scan-reddit` - Finds recent posts to the `PokemonGoFriends`
  subreddit and scans any that have the `Gifts & EXP grind` flair
  attached.
- `scan-twitter` - This launches a web browser (Safari by default, but
  you can edit the file to change it to Firefox or Chromium) and
  searches Twitter for recent posts that include `pokemon go trainer
  code`, which finds codes from people who have recently tweeted the
  invite message from within the game.  By default it will find the 50
  most recent matching messages, but you can change that by editing
  the configuration at the top of the file.
- `scan-files` - This doesn't actually get trainer codes for you, but
  if you have a text file that contains some trainer codes, or you
  know enough about scripting or programming to get trainer codes from
  some other location you know about, you can use this to extract the
  codes from those files.  Either run it and give it filenames as
  arguments, or you can pipe text to it on stdin.  For example, if you
  wanted to get some codes from a website that displayed them in an HTML
  list, could do something like this:
```
curl -L https://www.some-trainer-codes.example/ | grep '<li>' | ./scan-files
```


## Installation ##

In order to use this, you need NodeJS installed on your computer.
You'll also need git, and some idea how to use command-line tools.

 * https://nodejs.org/
 * https://git-scm.com/downloads

Once you have those requirements met, all you need to do is:

```
git clone https://github.com/jasonk/pogo-friends
cd pogo-friends
npm install
```

Then you can run any of the scanners you want to run:

```
./scan-twitter
./scan-reddit
```

Once you have collected some trainer codes, you can start adding them
in Pokemon Go:

```
./make-friends
```

Note: while this should work on Windows, it hasn't been tested there
as I don't have any Windows machines to try it with.  If running any
of the scripts directly doesn't work, you can try running them with
node:

```
node ./scan-twitter
node ./scan-reddit
node ./make-friends
```

## Other Stuff ##

- `cleanup` - This simple script just reads in your `new.txt` file,
  removes any codes that are already in the `did.txt` file and then
  writes it back out.  It's helpful if you want to know how many new
  codes you have in order to determine if you are going to try and
  find some more.  You don't need to run `cleanup` before you run
  `make-friends` though, because `make-friends` will skip the
  duplicates anyway.
