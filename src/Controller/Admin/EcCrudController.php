<?php

namespace App\Controller\Admin;

use App\Entity\Ec;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ArrayField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ColorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class EcCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Ec::class;
    }


    public function configureFields(string $pageName): iterable
    {
        $name=TextField::new('nom');
        $type=AssociationField::new('type');
        $vol=NumberField::new('vol');
        $promo=AssociationField::new('promo');
        $color=ColorField::new('color');
        $duree=NumberField::new('duree');
        $nbGroupes=NumberField::new('nbGroupes');
        $semaines=ArrayField::new('semaines');
        return [ $name, $type, $vol, $promo, $color, $duree, $nbGroupes, $semaines  ];
    }

}
