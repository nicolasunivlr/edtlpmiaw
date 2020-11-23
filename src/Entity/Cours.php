<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CoursRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass=CoursRepository::class)
 * @ApiResource(
 *     paginationEnabled=false,
 *     normalizationContext={"groups"={"read:cours"}},
 *     denormalizationContext={"groups"={"write:cours"}},
 * )
 * @ApiFilter(SearchFilter::class, properties={"semaine": "exact"})
 */
class Cours
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"read:cours"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Ec::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"read:cours", "write:cours"})
     */
    private $ec;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read:cours", "write:cours"})
     */
    private $semaine;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"read:cours", "write:cours"})
     */
    private $place;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"read:cours", "write:cours"})
     */
    private $groupe;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"read:cours", "write:cours"})
     */
    private $enseignant;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"read:cours", "write:cours"})
     */
    private $salle;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"read:cours", "write:cours"})
     */
    private $remarque;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"read:cours", "write:cours"})
     */
    private $date;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEc(): ?Ec
    {
        return $this->ec;
    }

    public function setEc(?Ec $ec): self
    {
        $this->ec = $ec;

        return $this;
    }

    public function getSemaine(): ?string
    {
        return $this->semaine;
    }

    public function setSemaine(string $semaine): self
    {
        $this->semaine = $semaine;

        return $this;
    }

    public function getPlace(): ?bool
    {
        return $this->place;
    }

    public function setPlace(bool $place): self
    {
        $this->place = $place;

        return $this;
    }

    public function getGroupe(): ?string
    {
        return $this->groupe;
    }

    public function setGroupe(string $groupe): self
    {
        $this->groupe = $groupe;

        return $this;
    }

    public function getEnseignant(): ?string
    {
        return $this->enseignant;
    }

    public function setEnseignant(?string $enseignant): self
    {
        $this->enseignant = $enseignant;

        return $this;
    }

    public function getSalle(): ?string
    {
        return $this->salle;
    }

    public function setSalle(?string $salle): self
    {
        $this->salle = $salle;

        return $this;
    }

    public function getRemarque(): ?string
    {
        return $this->remarque;
    }

    public function setRemarque(?string $remarque): self
    {
        $this->remarque = $remarque;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }
}
