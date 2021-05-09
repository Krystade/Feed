# Feed
Circles that try to stay alive and reproduce for as long as possible.

#Summary

*The number above each circle (mob) represents it's current time left in seconds. If the timer hits 0, the mob will die.
*Only mobs of a similar color are able to breed and they will only seek out valid mates.
*Each mob has it's own set of 12 "genes" that control how big and fast it is along with how often it can mate and how many ofspring it can produce at once.

##Offspring
*A mob can produce offspring by either mating with a similar colored mob and expending some of it's health to give to the offspring 
or by splitting and creating an identical copy to itself.
*When a mob produces offspring by mating there will be a chance of mutation (20% right now) for each of its genes. 
If a gene is not mutated one of the parents' genes will be selected to be passed on to the child
If a gene is mutated it's value can be increased or decreased by up to 20% of it's max allowed value.
*If a mob reaches 500 health then instead of looking for a mate it will split into 2 identical half the size. 
This method loses 30% of the mob's orignal health however

##Selecting a mob
When a mob is selected a menu will appear in the top right of the screen displaying it's personal statistics. Click the different icons to see different types of statistics.

If no mob is selected, move around with the arrow keys.
To deselect a mob, choose the Select option from Menu and click on the currently selected mob.


###Available Hotkeys

Spacebar: Pause/unpause the sim
G:        Cycle to next available stat graph. (graphs not currently working)
U:        Ungroup all mobs, placing them equidistant from each other.
S:        Toggle showing every living mob's color. (Currently selected mob will be highlighted.)
C:        Toggle showing every living mob of a similar color.
V:        Cycle to the next mob color group (shown if C has been pressed)
