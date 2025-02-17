# Reddit Auto Show More Comments

A simple [Chrome extension](https://chromewebstore.google.com/detail/reddit-auto-show-more-com/bhampaflpobmpgmaoccpdbdkeaoacoai) that automatically clicks buttons to reveal hidden Reddit comments for you, removing the need to manually click the numerous "(+) X more replies" and "View more comments" buttons scattered throughout threads.

## Features

- Auto-clicks "(+) X more replies" and "View more comments" buttons
- Auto-expands threads that have been collapsed by default by Reddit, when possible
- Progressively clicks buttons as you scroll (instead of all at once), to avoid Reddit rate limiting and browser lag on large threads

## Limitations

- Cannot always auto-expand threads that have been collapsed by default, due to shadow DOM limitations
- Does *not* click the "(+) X more replies" buttons that are external links to partial comment threads - you may still see these on the page

## Feedback

I probably can't dedicate much time to this project, nor guarantee a response, but feel free to [open an issue](https://github.com/alythobani/reddit-auto-show-more-comments-chrome/issues) for any bug reports or suggestions. Also feel free to submit a pull request or fork the project.

Have a great day and try to make someone else's day great too :)
