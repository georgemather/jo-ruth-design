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
    private $caption;
    private $print_materials;
    private $run;
    //to be replaced with a database retrieval function; just for testing right now
    function __construct($id){
      $this->id = $id;
      $this->filepath = array(1=>'001.jpg', 2=>'002.jpg', 3=>'003.jpg', 4=>'004.jpg', 5=>'005.jpg', 6=>'thumbnails/006.png', 7=>'thumbnails/007.png', 8=>'thumbnails/008.png', 9=>'thumbnails/009.png', 10=>'thumbnails/010.png')[$id];
      $this->title = array(1=>'Magpies - Upton Warren', 2=>'Barn Owl in Flowering Chestnut', 3=>'Waxwings in Spring Blossom', 4=>'Waxwings in Rowan', 5=>'Waxwings in Sea Buckthorn', 6=>'Central Library', 7=>'BT Tower', 8=>'St Paul\'s Square', 9=>'Victoria Square', 10=>'St Paul\'s Cathedral')[$id];
      $this->materials = array(1=>'Mixed media painting on card', 2=>'Mixed media painting on card', 3=>'Mixed media painting on card', 4=>'Mixed media painting on card', 5=>'Mixed media painting on card')[$id];
      $this->dimensions = array(1=>'54cm x 35cm', 2=>'85cm x 64cm', 3=>'44cm x 44cm', 4=>'44cm x 65cm', 5=>'44cm x 44cm')[$id];
      $this->print_materials = array(1=>'Unframed fine art giclee print of original', 2=>'Unframed fine art giclee print of original available', 3=>'Unframed fine art giclee print of original available', 4=>'Unframed fine art giclee print of original available', 5=>'Unframed fine art giclee print of original available')[$id];
      $this->run = array(1=>'Limited edition of 50', 2=>'Limited edition of 50', 3=>'Limited edition of 50', 4=>'Limited edition of 50', 5=>'Limited edition of 50')[$id];
      $this->caption = array(6=>'In imagination I have bought all the farms in succession, for all were to be bought, and I knew their price.', 7=>'I walked over each farmer\'s premises, tasted his wild apples, discoursed on husbandry with him, took his farm at his price, at any price, mortgaging it to him in my mind.', 8=>'This experience entitled me to be regarded as a sort of real-estate broker by my friends. ', 9=>'Wherever I sat, there I might live, and the landscape radiated from me accordingly. What is a house but a sedes, a seat?—better if a country seat.', 10=>'I discovered many a site for a house not likely to be soon improved, which some might have thought too far from the village, but to my eyes the village was too far from it.')[$id];
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
        "print_run" => $this->run,
        "caption" => $this->caption
      ));
    }
  }
?>
