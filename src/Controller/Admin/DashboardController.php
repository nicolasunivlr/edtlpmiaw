<?php

namespace App\Controller\Admin;

use App\Entity\Ec;
use App\Entity\Header;
use App\Entity\Promo;
use App\Entity\TypeCours;
use App\Entity\Utilisateur;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractDashboardController
{
    /**
     * @Route("/admin", name="admin")
     */
    public function index(): Response
    {
        return $this->render('admin/index.html.twig');
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Calendarsf');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linktoDashboard(false, 'fa fa-home');
        yield MenuItem::linkToCrud('Header', '', Header::class);
        yield MenuItem::linkToCrud('Promo', '', Promo::class);
        yield MenuItem::linkToCrud('TypeCours', '', TypeCours::class);
        yield MenuItem::linkToCrud('Ec', '', Ec::class);
        yield MenuItem::linkToCrud('Enseignants', '', Utilisateur::class);
        yield MenuItem::linkToRoute(false, 'fas fa-sign-out-alt', 'homepage');
    }

    public function configureActions(): Actions
    {
        $actions = parent::configureActions();
        $actions
            ->update(Crud::PAGE_INDEX, Action::EDIT, function (Action $action) {
                return $action->setIcon('fa fa-edit')->setLabel('');
            })
            ->update(Crud::PAGE_INDEX, Action::DELETE, function (Action $action) {
                return $action->setIcon('fa fa-trash')->setLabel('');
            });
        return $actions;
    }

    public function configureCrud(): Crud
    {
        $crud =  parent::configureCrud();
        return $crud->showEntityActionsInlined();
    }
}
