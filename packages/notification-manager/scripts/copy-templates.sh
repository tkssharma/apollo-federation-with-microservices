#!/bin/sh

set -x
rsync --relative ./src/app/domain/notifications/emails/user-signup-notification.html dist
