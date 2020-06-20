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

5. _(Optional: web interface)_ Point your webserver root to the `web` directory and enable PHP.
  Be sure to allow it to read/write the `config` directory:
  ```
  sudo chgrp www-data /opt/radiodata/config
  sudo chmod g+rwx /opt/radiodata/config
  ```

6. _(Optional: holidays)_ To prevent radioauto to run on holidays, create `config/holidays.txt`.
  This file should contain the holidays in the format `MM-DD` or `YYYY-MM-DD`, one per line.

## Usage

Your Pi should automatically start and stop streaming at the configured time.

If you ever need to disable it ad-hoc for a specific date, just access the web interface.

## Credits

* Logo made by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

## License

Licensed under [GPLv3](LICENSE)

Copyright (C) 2017-2020 [Rafael Cavalcanti](https://rafaelc.org/)
