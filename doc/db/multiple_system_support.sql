ALTER TABLE `xxl_job`.`xxl_job_info` ADD COLUMN `system_name` varchar(100) NOT NULL DEFAULT 'ordering' COMMENT '系统名称，用于区分不同系统调度' AFTER `robot_alarm`;