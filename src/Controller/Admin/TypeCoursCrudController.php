<?php

namespace App\Controller\Admin;

use App\Entity\TypeCours;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class TypeCoursCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return TypeCours::class;
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
