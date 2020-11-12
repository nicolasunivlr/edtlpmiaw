<?php

namespace App\Controller\Admin;

use App\Entity\Promo;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class PromoCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Promo::class;
    }

    /*
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id'),
            TextField::new('title'),
            TextEditorField::new('description'),
        ];
    }
    */
}
