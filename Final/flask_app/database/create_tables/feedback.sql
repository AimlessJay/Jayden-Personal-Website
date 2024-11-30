CREATE TABLE IF NOT EXISTS `feedback` (
`comment_id`       int(11)       NOT NULL AUTO_INCREMENT 	COMMENT 'The comment id',
`name`          varchar(20)      DEFAULT NULL                   COMMENT 'The commenters name',
`email`         varchar(100)     DEFAULT NULL                	COMMENT 'The the commenters email address',
`comment`       varchar(1000)    DEFAULT NULL              	    COMMENT 'content of comment',
PRIMARY KEY  (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Feedback from users";