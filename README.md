# radioauto

Smart morning (or any time) radio for the Raspberry Pi

## Introduction

This is my current setup for playing (and stopping) radio automatically on my Pi.

It consists of:

- a cronjob to schedule the radio play/stop, leveraging all the flexibility cron offers
- a Bash script for the missing flexibility: check for holidays, disable specific dates, set the volume, etc
- a (optional) web interface to disable running on specific dates easily

[Related blog post.](https://rafaelc.org/tech/p/smart-morning-radio-with-raspberry-pi-cron-and-mpd/)

## Dependencies

- cron
- mpc
- mpd

## Installation

1. Install the dependencies:
  On Raspbian:
  ```
  $ sudo apt install mpc mpd
  ```

2. Clone the repo:
  ```
  $ sudo git clone https://github.com/rccavalcanti/radioauto.git /opt/radioauto
  ```

3. Create a configuration for the host from the sample:
  ```
  $ cd /opt/radioauto/config
  $ sudo cp host.conf{.sample,}
  $ sudo -e host.conf
  ```

4. Create a cronjob from the sample:
  ```
  $ sudo cp /opt/radioauto/cron.sample /etc/cron.d/radioauto
  $ sudo -e /etc/cron.d/radioauto
  ```

  If you are not familiar with cron, read [`man 5 crontab`](https://linux.die.net/man/5/crontab).

5. _(Optional: web interface)_ Point your webserver root to the `web` directory. Enable PHP.

## Usage

Now your Pi should play and stop streaming on the time you pick.

If you ever need to disable the playback for a specific date, just access the web interface.

If you want the Pi to ignore the schedule on holidays, drop a plain text file at `/opt/radioauto/config/holidays.txt` with the dates in the format `YYYY-MM-DD`.

## Credits

* Logo made by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

## License

Licensed under [GPLv3](LICENSE)

Copyright (C) 2017-2020 [Rafael Cavalcanti](https://rafaelc.org/)
