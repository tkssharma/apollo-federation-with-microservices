#!/bin/sh

set -x
rsync --relative ./src/app/domain/notifications/emails/user-signup-notification.html dist
rsync --relative ./src/app/domain/notifications/emails/home-created-notification.html dist
rsync --relative ./src/app/domain/notifications/emails/user-password-reset-notification.html dist
