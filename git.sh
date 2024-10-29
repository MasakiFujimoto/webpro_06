#!/bin/bash

comment='README.mdから日付の時間を削除'

git add .
git commit -am $comment
git push

echo "実行完了 お疲れ様でした。"