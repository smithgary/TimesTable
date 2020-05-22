/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package timestablestest;

/**
 *
 * @author garysmith
 */
public class TimesTable {
    private Integer [][] answers;
    private Boolean [][] passFail;
    
    public void initTT(){
        for (int i=1; i<11; i++){
            for(int j=1; j<12; j++){ //was 12
                answers [i][j] = i*j;
                passFail [i][j] = false;
            }
        }
    }
    
}
