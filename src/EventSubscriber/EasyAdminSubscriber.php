<?php


namespace App\EventSubscriber;


use App\Entity\Utilisateur;
use EasyCorp\Bundle\EasyAdminBundle\Event\BeforeEntityPersistedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class EasyAdminSubscriber implements EventSubscriberInterface
{

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents()
    {
        return [
            BeforeEntityPersistedEvent::class => ['setWrongPasswordUser'],
        ];
    }

    public function setWrongPasswordUser(BeforeEntityPersistedEvent $event)
    {
        $entity = $event->getEntityInstance();

        if (!($entity instanceof Utilisateur)) {
            return;
        }

        $entity->setPassword('motdepassebidon');
    }
}