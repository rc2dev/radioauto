# radioauto

Smart morning (or any time) radio for the Raspberry Pi

## Introduction

This is my current setup for playing (and stopping) radio automatically on my Pi.

It consists of:

- a cronjob to schedule the radio play/stop, leveraging all the flexibility cron offers
- a Bash script for the missing flexibility: check for holidays, disable specific dates, set the volume, etc
- a (optional) web interface to disable running on specific dates easily

[Related blog post.](https://rafaelc.org/posts/smart-morning-radio-with-raspberry-pi-cron-and-mpd/)

## Dependencies

- cron
- mpc
- mpd

## Installation

1. Install the dependencies.  On Raspbian:
  ```
  $ sudo apt install mpc mpd
  ```

2. Clone the repo:
  ```
  $ sudo git clone https://github.com/rc2dev/radioauto.git /opt/radioauto
  ```

3. Configure the host parameters:
  ```
  $ sudo mkdir /etc/radioauto
  $ sudo cp /opt/radioauto/docs/host.conf.sample /etc/radioauto/host.conf
  $ sudo -e /etc/radioauto/host.conf
  ```

4. Create the cronjob from the sample:
  ```
  $ sudo cp /opt/radioauto/docs/cron.sample /etc/cron.d/radioauto
  $ sudo -e /etc/cron.d/radioauto
  ```

  If you are not familiar with cron, read [`man 5 crontab`](https://linux.die.net/man/5/crontab).

5. _(Optional: web interface)_ Point your webserver root to the `web` directory and enable PHP.

  Be sure to allow it to read/write the configuration directory:
  ```
  $ sudo chgrp www-data /etc/radiodata
  $ sudo chmod g+rwx /etc/radiodata
  ```

6. _(Optional: holidays)_ To prevent radioauto to run on holidays:
  ```
  $ sudo -e /etc/radioauto/holidays.txt
  ```

  Fill this file with the holidays in the format `MM-DD` or `YYYY-MM-DD`, one per line.

## Usage

Your Pi should automatically start and stop streaming at the configured time.

If you ever need to disable it ad-hoc for a specific date, just access the web interface.

## Credits

* Logo made by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

## License

Licensed under [GPLv3](LICENSE)

Copyright (C) 2017-2020 [Rafael Cavalcanti](https://rafaelc.org/dev)
