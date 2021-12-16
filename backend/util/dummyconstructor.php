<?php

class DummyConstructor{
	private $destruct;

	public function __construct(callable $destruct){
		$this->destruct = $destruct;
	}

	public function __destruct(){
		$a = $this->destruct;
		$a();
	}
}