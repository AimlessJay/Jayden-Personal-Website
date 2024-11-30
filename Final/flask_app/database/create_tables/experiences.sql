CREATE TABLE IF NOT EXISTS `experiences` (
`xp_id`          int(11)       NOT NULL AUTO_INCREMENT 	COMMENT 'The experiences id',
`position_id`    int(11)       NOT NULL                 COMMENT 'FK:position id from positions table',
`name`           varchar(100)  NOT NULL                 COMMENT 'The name of the experiences',
`description`    varchar(500)  NOT NULL             	COMMENT 'Description of experiences',
`hyperlink`      varchar(100)  DEFAULT NULL            	COMMENT 'A link where people can learn more about the experience.',
`start_date`     date          DEFAULT NULL             COMMENT 'My start date for this position',
`end_date`       date          DEFAULT NULL             COMMENT 'The end date for this position',
PRIMARY KEY  (`xp_id`),
FOREIGN KEY (position_id) REFERENCES positions(position_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Experiences i've had";