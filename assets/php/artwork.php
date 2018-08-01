<?php
  $id = isset($_POST['artwork_id']) ? ltrim($_POST['artwork_id'], '0') : 1;
  $art = new artwork($id);
  $art->output();


  class artwork {
    private $id;
    private $filepath;
    private $title;
    private $materials;
    private $dimensions;
    private $print_materials;
    private $run;
    //to be replaced with a database retrieval function; just for testing right now
    function __construct($id){
      $this->id = $id;
      $this->filepath = array(1=>'001.jpg', 2=>'002.jpg', 3=>'003.jpg', 4=>'004.jpg', 5=>'005.jpg')[$id];
      $this->title = array(1=>'Magpies - Upton Warren', 2=>'Barn Owl in Flowering Chestnut', 3=>'Waxwings in Spring Blossom', 4=>'Waxwings in Rowan', 5=>'Waxwings in Sea Buckthorn')[$id];
      $this->materials = array(1=>'Mixed media painting on card', 2=>'Mixed media painting on card', 3=>'Mixed media painting on card', 4=>'Mixed media painting on card', 5=>'Mixed media painting on card')[$id];
      $this->dimensions = array(1=>'54cm x 35cm', 2=>'85cm x 64cm', 3=>'44cm x 44cm', 4=>'44cm x 65cm', 5=>'44cm x 44cm')[$id];
      $this->print_materials = array(1=>'Unframed fine art giclee print of original', 2=>'Unframed fine art giclee print of original available', 3=>'Unframed fine art giclee print of original available', 4=>'Unframed fine art giclee print of original available', 5=>'Unframed fine art giclee print of original available')[$id];
      $this->run = array(1=>'Limited edition of 50', 2=>'Limited edition of 50', 3=>'Limited edition of 50', 4=>'Limited edition of 50', 5=>'Limited edition of 50')[$id];
    }
    //json accessor method
    public function output(){
      echo json_encode(array(
        "id" => $this->id,
        "path" => $this->filepath,
        "title" => $this->title,
        "materials" => $this->materials,
        "dimensions" => $this->dimensions,
        "print_materials" => $this->print_materials,
        "print_run" => $this->run
      ));
    }
  }
?>
