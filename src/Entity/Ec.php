<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\EcRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass=EcRepository::class)
 * @ApiResource(
 *     paginationEnabled=false,
 *     normalizationContext={"groups"={"read:ec"}},
 *     denormalizationContext={"groups"={"write:ec"}},
 * )
 * @ApiFilter(SearchFilter::class, properties={"annee": "exact","nom":"exact"})
 */
class Ec
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"read:ec","read:cours"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read:ec", "write:ec","read:cours"})
     */
    private $nom;

    /**
     * @ORM\ManyToOne(targetEntity=TypeCours::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"read:ec", "write:ec","read:cours"})
     */
    private $type;

    /**
     * @ORM\Column(type="float")
     * @Groups({"read:ec", "write:ec"})
     */
    private $vol;

    /**
     * @ORM\ManyToOne(targetEntity=Promo::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"read:ec", "write:ec","read:cours"})
     */
    private $promo;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"read:ec", "write:ec","read:cours"})
     */
    private $color;

    /**
     * @ORM\Column(type="float")
     * @Groups({"read:ec", "write:ec","read:cours"})
     */
    private $duree;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"read:ec", "write:ec"})
     */
    private $nbGroupes;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"read:ec", "write:ec"})
     */
    private $semaines = [];

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"read:ec", "write:ec"})
     */
    private $annee;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

    public function getType(): ?TypeCours
    {
        return $this->type;
    }

    public function setType(?TypeCours $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getVol(): ?float
    {
        return $this->vol;
    }

    public function setVol(float $vol): self
    {
        $this->vol = $vol;

        return $this;
    }

    public function getPromo(): ?Promo
    {
        return $this->promo;
    }

    public function setPromo(?Promo $promo): self
    {
        $this->promo = $promo;

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function getDuree(): ?float
    {
        return $this->duree;
    }

    public function setDuree(float $duree): self
    {
        $this->duree = $duree;

        return $this;
    }

    public function getNbGroupes(): ?int
    {
        return $this->nbGroupes;
    }

    public function setNbGroupes(int $nbGroupes): self
    {
        $this->nbGroupes = $nbGroupes;

        return $this;
    }

    public function getSemaines(): ?array
    {
        return $this->semaines;
    }

    public function setSemaines(?array $semaines): self
    {
        $this->semaines = $semaines;

        return $this;
    }

    public function getAnnee(): ?int
    {
        return $this->annee;
    }

    public function setAnnee(?int $annee): self
    {
        $this->annee = $annee;

        return $this;
    }
}
