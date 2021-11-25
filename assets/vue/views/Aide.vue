<template>
  <div class="about">
    <h1>Mode d'emploi</h1>
    <h2>Gestion du planning</h2>
    <ul>
      <li>On crée un EC : duréé correspond à la durée d'un cours, volume correspond nombre d'heures globales de l'EC sur l'année</li>
      <li>On place les heures dans les semaines</li>
      <li>On peut modifier un EC en cliquant sur le crayon</li>
      <li>Si on modifie les heures d'une semaine pour un EC, tous les cours de l'EC sont à replacer</li>
      <li><p>Dans une case, si c'est en vert, c'est que toutes heures disponibles ont été placées.</p><p>Sinon, le premier nombre définit
        le nombre d'heures placées et celui entre parenthèses celui des heures totales de la semaine.</p>
        <p>En rouge quand le nombre d'heures effectives dépasse.</p></li>
      <li>Les Ecs peuvent être triés par nom en cliquant sur le libellé. Par défaut, ils sont classés par ordre de création</li>
      <li>En survolant une semaine, on peut voir le nombre d'heures par promo (hors AP, non-AP)</li>
      <li>On peut changer d'année en la sélectionnant dans la liste déroulante en dessous de planning de l'année</li>
    </ul>
    <h2>Gestion de l'emploi du temps</h2>
    <ul>
      <li>Les cours disponibles peuvent être placés par glisser/déposer</li>
      <li>On peut cliquer sur un cours pour ajouter un enseignant, une salle, ou un commentaire</li>
      <li>On tombe sur la semaine courante quand on utilise le menu pour aller sur l'emploi du temps</li>
      <li>On peut se déplacer dans les semaines en cliquant sur les chevrons à droite et à gauche de la semaine</li>
      <li>On peut ajouter un créneau de projet tuteuré pour un nombre d'heure déterminé. Par l'instant, c'est pour toute la promo</li>
      <li>On peut modifier la durée d'un créneau pour un cours donné</li>
      <li>On peut permetter deux cours qui sont placés à condition qu'ils appartiennent au même groupe</li>
    </ul>
    <h2>Charge horaire des enseignants</h2>
    <ul>
      <li>On peut voir par année, la charge de chaque enseignant de manière globale</li>
      <li>En cliquant à droite d'un enseignant, le détail apparait</li>
      <li>On peut changer d'année en cours, valable également pour planning et EDT</li>
    </ul>
    <h2>Préférences</h2>
    <ul>
      <li>J'ai retiré ce composant, pas stable...</li>
      <li>On peut activer le contrôle du placement des cours.(béta)</li>
    </ul>
    <h3>Version 1.1.1</h3>
  </div>
</template>

<style scoped>
* {
  margin: 10px;
}
</style>
