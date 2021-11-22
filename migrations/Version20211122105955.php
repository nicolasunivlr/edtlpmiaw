<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211122105955 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cours ADD prof_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE cours ADD CONSTRAINT FK_FDCA8C9CABC1F7FE FOREIGN KEY (prof_id) REFERENCES utilisateur (id)');
        $this->addSql('CREATE INDEX IDX_FDCA8C9CABC1F7FE ON cours (prof_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cours DROP FOREIGN KEY FK_FDCA8C9CABC1F7FE');
        $this->addSql('DROP INDEX IDX_FDCA8C9CABC1F7FE ON cours');
        $this->addSql('ALTER TABLE cours DROP prof_id');
    }
}
