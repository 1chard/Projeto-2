<?php
	function fields(): array{
		return array_slice(preg_split("[/]", $_SERVER["REQUEST_URI"]), count(preg_split("[/]", $_SERVER["SCRIPT_NAME"])));
	}