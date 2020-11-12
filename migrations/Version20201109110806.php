<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201109110806 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE cours (id INT AUTO_INCREMENT NOT NULL, ec_id INT NOT NULL, semaine VARCHAR(255) NOT NULL, duree DOUBLE PRECISION NOT NULL, place TINYINT(1) NOT NULL, pos_top SMALLINT NOT NULL, pos_left SMALLINT NOT NULL, groupe VARCHAR(255) NOT NULL, INDEX IDX_FDCA8C9C27634BEF (ec_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ec (id INT AUTO_INCREMENT NOT NULL, type_id INT NOT NULL, promo_id INT NOT NULL, name VARCHAR(255) NOT NULL, vol DOUBLE PRECISION NOT NULL, color VARCHAR(255) DEFAULT NULL, duree DOUBLE PRECISION NOT NULL, nb_groupes INT NOT NULL, INDEX IDX_8DE8BDFFC54C8C93 (type_id), INDEX IDX_8DE8BDFFD0C07AFF (promo_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE header (id INT AUTO_INCREMENT NOT NULL, texte VARCHAR(255) NOT NULL, value VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE promo (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE type_cours (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE cours ADD CONSTRAINT FK_FDCA8C9C27634BEF FOREIGN KEY (ec_id) REFERENCES ec (id)');
        $this->addSql('ALTER TABLE ec ADD CONSTRAINT FK_8DE8BDFFC54C8C93 FOREIGN KEY (type_id) REFERENCES type_cours (id)');
        $this->addSql('ALTER TABLE ec ADD CONSTRAINT FK_8DE8BDFFD0C07AFF FOREIGN KEY (promo_id) REFERENCES promo (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cours DROP FOREIGN KEY FK_FDCA8C9C27634BEF');
        $this->addSql('ALTER TABLE ec DROP FOREIGN KEY FK_8DE8BDFFD0C07AFF');
        $this->addSql('ALTER TABLE ec DROP FOREIGN KEY FK_8DE8BDFFC54C8C93');
        $this->addSql('DROP TABLE cours');
        $this->addSql('DROP TABLE ec');
        $this->addSql('DROP TABLE header');
        $this->addSql('DROP TABLE promo');
        $this->addSql('DROP TABLE type_cours');
    }
}
